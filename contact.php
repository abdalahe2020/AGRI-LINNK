<?php
/* ============================================
   AGRI-CHAIN — php/contact.php
   Handles POST contact form submissions
   ============================================ */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ---- Read body ----
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// ---- Log received inputs for debugging ----
error_log("Contact form inputs: " . json_encode($input));

// ---- Required fields ----
$required = ['full_name', 'email', 'user_type', 'message'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "الحقل '$field' مطلوب"]);
        exit;
    }
}

$full_name = trim($input['full_name']);
$email     = trim($input['email']);
$user_type = trim($input['user_type']);
$message   = trim($input['message']);

// ---- Validate email ----
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني غير صحيح']);
    exit;
}

// ---- DB connection ----
$host   = 'localhost';
$dbname = 'agrichain';
$dbuser = 'root';
$dbpass = '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $dbuser,
        $dbpass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات']);
    exit;
}

// ---- Insert message ----
try {
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages (full_name, email, user_type, message)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$full_name, $email, $user_type, $message]);

    echo json_encode([
        'success' => true,
        'message' => 'تم إرسال رسالتك بنجاح! سيتواصل معك فريقنا قريبًا.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء إرسال الرسالة: ' . $e->getMessage()]);
}
?>