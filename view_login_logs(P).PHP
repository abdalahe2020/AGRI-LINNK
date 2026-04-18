<?php
/* ============================================
   AGRI-CHAIN — php/view_login_logs.php
   View login logs for admin
   ============================================ */

session_start();

// ---- Check if admin ----
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo "Access denied. Admin only.";
    exit;
}

// ---- Database connection ----
$host   = 'localhost';
$dbname = 'agrichain';
$user   = 'root';
$pass   = '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    echo "خطأ في الاتصال بقاعدة البيانات: " . $e->getMessage();
    exit;
}

// ---- Fetch logs ----
$stmt = $pdo->query("
    SELECT l.*, u.first_name, u.last_name
    FROM login_logs l
    LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC
    LIMIT 100
");
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>سجلات تسجيل الدخول</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
        th { background-color: #f2f2f2; }
        .success { color: green; }
        .failure { color: red; }
    </style>
</head>
<body>
    <h1>سجلات تسجيل الدخول</h1>
    <table>
        <tr>
            <th>ID</th>
            <th>البريد</th>
            <th>الاسم</th>
            <th>IP</th>
            <th>نجح</th>
            <th>التاريخ</th>
        </tr>
        <?php foreach ($logs as $log): ?>
        <tr>
            <td><?php echo $log['id']; ?></td>
            <td><?php echo htmlspecialchars($log['email']); ?></td>
            <td><?php echo htmlspecialchars(($log['first_name'] ?? '') . ' ' . ($log['last_name'] ?? '')); ?></td>
            <td><?php echo htmlspecialchars($log['ip_address'] ?? ''); ?></td>
            <td class="<?php echo $log['success'] ? 'success' : 'failure'; ?>">
                <?php echo $log['success'] ? 'نعم' : 'لا'; ?>
            </td>
            <td><?php echo $log['created_at']; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>