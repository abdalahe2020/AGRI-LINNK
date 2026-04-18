<?php
/* ============================================
   AGRI-CHAIN — php/create_test_user.php
   Create a test user for login testing
   ============================================ */

header('Content-Type: text/plain');

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
    echo "فشل الاتصال بقاعدة البيانات: " . $e->getMessage() . "\n";
    echo "تأكد من تشغيل XAMPP وإنشاء قاعدة البيانات.\n";
    exit;
}

// ---- Test user data ----
$testEmail = 'test@example.com';
$testPassword = 'password123';
$hash = password_hash($testPassword, PASSWORD_BCRYPT);

// ---- Check if user exists ----
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$testEmail]);
if ($stmt->fetch()) {
    echo "المستخدم الاختباري موجود بالفعل.\n";
    echo "البريد: $testEmail\n";
    echo "كلمة المرور: $testPassword\n";
    exit;
}

// ---- Insert test user ----
try {
    $stmt = $pdo->prepare("
        INSERT INTO users
            (first_name, last_name, phone, email, password_hash, role, created_at)
        VALUES
            (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute(['Test', 'User', '01000000000', $testEmail, $hash, 'farmer']);
    $userId = $pdo->lastInsertId();

    // If farmer, insert into farmer_profiles
    if ('farmer' === 'farmer') {
        $stmtFarm = $pdo->prepare("
            INSERT INTO farmer_profiles
                (user_id, governorate, city, crop_type, land_area_feddan, expected_qty_ton)
            VALUES
                (?, ?, ?, ?, ?, ?)
        ");
        $stmtFarm->execute([
            $userId,
            'القاهرة', // governorate
            'القاهرة', // city
            'طماطم', // crop_type
            5.0, // land_area_feddan
            10.0 // expected_qty_ton
        ]);
    }

    echo "تم إنشاء المستخدم الاختباري بنجاح!\n";
    echo "البريد: $testEmail\n";
    echo "كلمة المرور: $testPassword\n";

} catch (PDOException $e) {
    echo "خطأ في إنشاء المستخدم: " . $e->getMessage() . "\n";
}

// ---- Create trader user ----
$traderEmail = 'trader@example.com';
$traderPassword = 'trader123';
$traderHash = password_hash($traderPassword, PASSWORD_BCRYPT);

// ---- Check if trader exists ----
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$traderEmail]);
if ($stmt->fetch()) {
    echo "التاجر موجود بالفعل.\n";
} else {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO users
                (first_name, last_name, phone, email, password_hash, role, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute(['Trader', 'User', '01200000000', $traderEmail, $traderHash, 'trader']);
        $traderId = $pdo->lastInsertId();

        // If trader, insert into trader_profiles
        $stmtTrader = $pdo->prepare("
            INSERT INTO trader_profiles (user_id, company_name, goods_type)
            VALUES (?, ?, ?)
        ");
        $stmtTrader->execute([
            $traderId,
            'شركة التجارة', // company_name
            'فواكه وخضروات' // goods_type
        ]);

        echo "تم إنشاء التاجر بنجاح!\n";
        echo "البريد: $traderEmail\n";
        echo "كلمة المرور: $traderPassword\n";

    } catch (PDOException $e) {
        echo "خطأ في إنشاء التاجر: " . $e->getMessage() . "\n";
    }
}
?>