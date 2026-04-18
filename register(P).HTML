<?php
/* ============================================
   AGRI-CHAIN — php/register.php
   Handles POST registration requests
   Supports roles: farmer | trader
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
error_log("Registration inputs: " . json_encode($input));

// ---- Required fields (all roles) ----
$required = ['first', 'last', 'phone', 'email', 'password', 'role'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "الحقل '$field' مطلوب"]);
        exit;
    }
}

$first    = trim($input['first']);
$last     = trim($input['last']);
$phone    = trim($input['phone']);
$email    = trim($input['email']);
$password = $input['password'];
$role     = $input['role'];           // 'farmer' | 'trader'

// ---- Validate email ----
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني غير صحيح']);
    exit;
}

// ---- Validate Egyptian phone ----
if (!preg_match('/^01[0125]\d{8}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'رقم الهاتف غير صحيح']);
    exit;
}

// ---- Password length ----
if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل']);
    exit;
}

// ---- Farmer-specific required fields ----
if ($role === 'farmer') {
    $farmerFields = ['governorate', 'city', 'cropType', 'landArea', 'quantity'];
    foreach ($farmerFields as $f) {
        if (empty($input[$f])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "الحقل '$f' مطلوب للمزارع"]);
            exit;
        }
    }
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

// ---- Check duplicate email ----
$check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$check->execute([$email]);
if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجّل بالفعل']);
    exit;
}

// ---- Hash password ----
$hash = password_hash($password, PASSWORD_BCRYPT);

// ---- Begin transaction ----
$pdo->beginTransaction();

try {
    // Insert into users table
    $stmtUser = $pdo->prepare("
        INSERT INTO users
            (first_name, last_name, phone, email, password_hash, role, created_at)
        VALUES
            (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmtUser->execute([$first, $last, $phone, $email, $hash, $role]);
    $userId = $pdo->lastInsertId();

    // If farmer → insert farm profile
    if ($role === 'farmer') {
        $stmtFarm = $pdo->prepare("
            INSERT INTO farmer_profiles
                (user_id, governorate, city, crop_type, land_area_feddan, expected_qty_ton)
            VALUES
                (?, ?, ?, ?, ?, ?)
        ");
        $stmtFarm->execute([
            $userId,
            $input['governorate'],
            $input['city'],
            $input['cropType'],
            (float)$input['landArea'],
            (float)$input['quantity'],
        ]);
    }

    // If trader → insert trader profile (if company name provided)
    if ($role === 'trader' && !empty($input['companyName'])) {
        $stmtTrader = $pdo->prepare("
            INSERT INTO trader_profiles (user_id, company_name, goods_type)
            VALUES (?, ?, ?)
        ");
        $stmtTrader->execute([
            $userId,
            $input['companyName'],
            $input['goodsType'] ?? 'متعدد',
        ]);
    }

    $pdo->commit();

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء الحفظ: ' . $e->getMessage()]);
    exit;
}

// ---- Start session ----
session_start();
$_SESSION['user_id']   = $userId;
$_SESSION['user_name'] = "$first $last";
$_SESSION['user_role'] = $role;

// ---- Success response ----
echo json_encode([
    'success'  => true,
    'message'  => 'تم إنشاء الحساب بنجاح',
    'redirect' => 'dashboard.html',
    'user'     => [
        'id'    => $userId,
        'name'  => "$first $last",
        'role'  => $role,
        'email' => $email,
    ]
]);
