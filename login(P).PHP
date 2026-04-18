<?php
/* ============================================
   AGRI-CHAIN — php/login.php
   Handles POST login requests
   ============================================ */

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ---- Only accept POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ---- Get JSON body ----
$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'يرجى إرسال البيانات بتنسيق JSON صالح']);
    exit;
}

if (!$input) {
    // Fallback to form data
    $input = $_POST;
}

// ---- Log received inputs for debugging ----
error_log("Received inputs: " . json_encode($input));

// ---- Validate required fields ----
$email    = trim($input['email']    ?? '');
$password = trim($input['password'] ?? '');

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان']);
    exit;
}

// ---- Database connection ----
$host   = 'localhost';
$dbname = 'agrichain';
$user   = 'root';
$pass   = '';                          // ← Change in production

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    error_log("Database connection error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات. تأكد من تشغيل XAMPP وإنشاء قاعدة البيانات.']);
    exit;
}

// ---- Look up user ----
try {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $userRow = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    error_log("Query error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطأ في البحث عن المستخدم']);
    exit;
}

$loginSuccess = false;
$userId = null;

if ($userRow && password_verify($password, $userRow['password_hash'])) {
    $loginSuccess = true;
    $userId = $userRow['id'];
} else {
    $loginSuccess = false;
}

// ---- Log the login attempt ----
try {
    $logStmt = $pdo->prepare("
        INSERT INTO login_logs (user_id, email, ip_address, user_agent, success)
        VALUES (?, ?, ?, ?, ?)
    ");
    $logStmt->execute([
        $userId,
        $email,
        $_SERVER['REMOTE_ADDR'] ?? null,
        $_SERVER['HTTP_USER_AGENT'] ?? null,
        $loginSuccess ? 1 : 0
    ]);
} catch (PDOException $e) {
    error_log("Login log error: " . $e->getMessage());
    // Don't fail on logging error, just continue
}

if (!$loginSuccess) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
    exit;
}

// ---- Start session ----
session_start();
$_SESSION['user_id']   = $userRow['id'];
$_SESSION['user_name'] = $userRow['first_name'] . ' ' . $userRow['last_name'];
$_SESSION['user_role'] = $userRow['role'];

// ---- Return success ----
echo json_encode([
    'success'  => true,
    'message'  => 'تم تسجيل الدخول بنجاح',
    'redirect' => 'dashboard.html',
    'user'     => [
        'id'    => $userRow['id'],
        'name'  => $_SESSION['user_name'],
        'role'  => $userRow['role'],
        'email' => $userRow['email'],
    ]
]);
