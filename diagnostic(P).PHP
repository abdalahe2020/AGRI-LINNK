<?php
/* ============================================
   AGRI-CHAIN — php/diagnostic.php
   Diagnostic tool to check system setup
   ============================================ */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>فحص النظام</title>
    <style>
        body { font-family: 'Cairo', Arial; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; }
        .check { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-right: 4px solid #27ae60; }
        .check.fail { border-right-color: #e74c3c; }
        .check.warn { border-right-color: #f39c12; }
        h1 { color: #333; }
        .status { font-weight: bold; margin-top: 10px; }
        .pass { color: #27ae60; }
        .fail { color: #e74c3c; }
        .warn { color: #f39c12; }
        code { background: #f0f0f0; padding: 5px 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 فحص صحة نظام اجري-تشين</h1>

        <?php
        $allPass = true;

        // 1. Check PHP version
        echo '<div class="check">';
        echo '<h3>1. إصدار PHP</h3>';
        echo '<p>الحالي: ' . phpversion() . '</p>';
        if (version_compare(phpversion(), '7.2') >= 0) {
            echo '<p class="status"><span class="pass">✓ جاهز</span></p>';
        } else {
            echo '<p class="status"><span class="fail">✗ PHP قديم جداً (مطلوب 7.2+)</span></p>';
            $allPass = false;
        }
        echo '</div>';

        // 2. Check MySQL extension
        echo '<div class="check">';
        echo '<h3>2. PDO MySQL Extension</h3>';
        if (extension_loaded('pdo_mysql')) {
            echo '<p class="status"><span class="pass">✓ مثبت</span></p>';
        } else {
            echo '<p class="status"><span class="fail">✗ غير مثبت - مطلوب لها الاتصال بـ MySQL</span></p>';
            $allPass = false;
        }
        echo '</div>';

        // 3. Try database connection
        echo '<div class="check">';
        echo '<h3>3. اتصال قاعدة البيانات</h3>';
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
            echo '<p class="status"><span class="pass">✓ الاتصال نجح</span></p>';

            // Check if tables exist
            echo '<div style="margin-top: 10px;">';
            $tables = ['users', 'login_logs', 'farmer_profiles', 'trader_profiles', 'contact_messages'];
            foreach ($tables as $table) {
                $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
                $exists = $stmt->fetch();
                if ($exists) {
                    echo '<p style="margin: 5px 0;"><span class="pass">✓</span> جدول <code>' . $table . '</code> موجود</p>';
                } else {
                    echo '<p style="margin: 5px 0;"><span class="fail">✗</span> جدول <code>' . $table . '</code> غير موجود</p>';
                    $allPass = false;
                }
            }
            echo '</div>';

        } catch (PDOException $e) {
            echo '<p class="status"><span class="fail">✗ فشل الاتصال</span></p>';
            echo '<p style="color: #e74c3c; margin-top: 10px;">الخطأ: ' . htmlspecialchars($e->getMessage()) . '</p>';
            echo '<p style="margin-top: 10px;"><strong>الحل:</strong></p>';
            echo '<ul>';
            echo '<li>تأكد من تشغيل XAMPP (Apache و MySQL)</li>';
            echo '<li>افتح phpMyAdmin وأنشئ قاعدة بيانات <code>agrichain</code></li>';
            echo '<li>استورد ملف <code>php/database.sql</code> لإنشاء الجداول</li>';
            echo '</ul>';
            $allPass = false;
        }
        echo '</div>';

        // 4. Check if test user exists
        if (isset($pdo)) {
            echo '<div class="check">';
            echo '<h3>4. المستخدمين الاختباريين</h3>';
            try {
                $stmt = $pdo->prepare('SELECT email, role FROM users ORDER BY created_at DESC LIMIT 5');
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($users) {
                    echo '<p style="margin-bottom: 10px;">المستخدمون الموجودون:</p>';
                    echo '<ul>';
                    foreach ($users as $u) {
                        echo '<li>' . htmlspecialchars($u['email']) . ' - دور: ' . htmlspecialchars($u['role']) . '</li>';
                    }
                    echo '</ul>';
                } else {
                    echo '<p class="status"><span class="warn">⚠ لا يوجد مستخدمون</span></p>';
                    echo '<p style="margin-top: 10px;"><strong>اقترح:</strong> افتح <code>http://localhost/new/agri-chain/php/create_test_user.php</code> لإنشاء مستخدمين اختباريين</p>';
                }
            } catch (Exception $e) {
                echo '<p class="status"><span class="warn">⚠ خطأ في الاستعلام</span></p>';
                echo '<p style="color: #f39c12;">' . htmlspecialchars($e->getMessage()) . '</p>';
            }
            echo '</div>';
        }

        // 5. Summary
        echo '<div class="check">';
        echo '<h3>📊 الملخص</h3>';
        if ($allPass) {
            echo '<p class="status"><span class="pass">✓ كل شيء جاهز! يمكنك بدء الاختبار</span></p>';
            echo '<p></p>';
            echo '<p style="margin-top: 15px;"><strong>الخطوات التالية:</strong></p>';
            echo '<ol>';
            echo '<li>افتح <code>http://localhost/new/agri-chain/php/create_test_user.php</code> لإنشاء مستخدمين</li>';
            echo '<li>افتح <code>http://localhost/new/agri-chain/login.html</code> وجرب تسجيل الدخول</li>';
            echo '<li>البريد: <code>test@example.com</code> - كلمة المرور: <code>password123</code></li>';
            echo '</ol>';
        } else {
            echo '<p class="status"><span class="fail">✗ هناك مشاكل توجب إصلاحها قبل البدء</span></p>';
            echo '<p style="margin-top: 10px; color: #e74c3c;">تحقق من الفحوصات أعلاه والتزم بـ "الحل" المقترح</p>';
        }
        echo '</div>';
        ?>
    </div>
</body>
</html>