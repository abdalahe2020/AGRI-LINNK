<?php
/* ============================================
   AGRI-CHAIN — php/test_login.php
   Manual login test without frontend
   ============================================ */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>اختبار تسجيل الدخول</title>
    <style>
        body { font-family: 'Cairo', Arial; margin: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; }
        .box { background: white; padding: 20px; border-radius: 8px; margin: 10px 0; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #229954; }
        .result { margin-top: 20px; padding: 15px; border-radius: 4px; }
        .success { background: #d5f4e6; border: 1px solid #27ae60; color: #27ae60; }
        .error { background: #fadbd8; border: 1px solid #e74c3c; color: #e74c3c; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 اختبر تسجيل الدخول</h1>

        <div class="box">
            <h3>البيانات الاختبارية الافتراضية:</h3>
            <ul>
                <li>البريد: <code>test@example.com</code></li>
                <li>كلمة المرور: <code>password123</code></li>
                <li>النوع: مزارع</li>
            </ul>
            <p>أو استخدم بيانات المدير:</p>
            <ul>
                <li>البريد: <code>admin@example.com</code></li>
                <li>كلمة المرور: <code>admin123</code></li>
            </ul>
        </div>

        <div class="box">
            <form id="loginForm">
                <label>البريد الإلكتروني:</label>
                <input type="email" id="email" placeholder="example@mail.com" value="test@example.com" required>

                <label>كلمة المرور:</label>
                <input type="password" id="password" placeholder="••••••••" value="password123" required>

                <button type="button" onclick="testLogin()">🚀 جرب تسجيل الدخول</button>
            </form>
        </div>

        <div id="resultBox"></div>
    </div>

    <script>
        function testLogin() {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('ملء جميع الحقول من فضلك');
                return;
            }

            const resultBox = document.getElementById('resultBox');
            resultBox.innerHTML = '<div class="result" style="background: #ffeaa7; color: #d48806;">جاري الاختبار...</div>';

            const loginUrl = window.location.origin + '/new/agri-chain/php/login.php';

            fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(async response => {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        resultBox.innerHTML = `
                            <div class="result success">
                                <strong>✓ نجح تسجيل الدخول!</strong>
                                <p>المستخدم: <code>${data.user.name}</code></p>
                                <p>البريد: <code>${data.user.email}</code></p>
                                <p>الدور: <code>${data.user.role}</code></p>
                                <p>الرسالة: ${data.message}</p>
                            </div>
                        `;
                    } else {
                        resultBox.innerHTML = `
                            <div class="result error">
                                <strong>✗ فشل تسجيل الدخول</strong>
                                <p>${data.message}</p>
                            </div>
                        `;
                    }
                } catch (ex) {
                    resultBox.innerHTML = `
                        <div class="result error">
                            <strong>✗ خطأ في اتصال الـ API</strong>
                            <p>الاستجابة لم تكن JSON صالحة.</p>
                            <pre style="white-space: pre-wrap; background: #f0f0f0; padding: 10px; border-radius: 4px;">${text}</pre>
                            <p style="font-size: 12px; margin-top: 10px;">
                                تأكد من:<br>
                                1. فتح الصفحة عبر <code>http://localhost/new/agri-chain/php/test_login.php</code><br>
                                2. تشغيل XAMPP (Apache و MySQL)<br>
                                3. وجود قاعدة البيانات <code>agrichain</code><br>
                                4. وجود جدول <code>users</code> والمستخدمين
                            </p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                resultBox.innerHTML = `
                    <div class="result error">
                        <strong>✗ خطأ في الاتصال</strong>
                        <p>${error.message}</p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            تأكد من:<br>
                            1. تشغيل XAMPP (Apache و MySQL)<br>
                            2. وجود قاعدة البيانات <code>agrichain</code><br>
                            3. وجود جدول <code>users</code> والمستخدمين<br>
                            افتح <code>http://localhost/new/agri-chain/php/diagnostic.php</code> للفحص الكامل
                        </p>
                    </div>
                `;
            });
        }

        // Test on page load
        window.addEventListener('load', () => {
            console.log('Test page loaded. Use the form above to test login.');
        });
    </script>
</body>
</html>