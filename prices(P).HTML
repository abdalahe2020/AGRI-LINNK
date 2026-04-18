<?php
/* ============================================
   AGRI-CHAIN — php/prices.php
   Returns latest crop prices as JSON
   GET  /prices.php              → all prices
   GET  /prices.php?crop=طماطم  → single crop
   ============================================ */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');

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
    // Return mock data if DB unavailable (for demo/dev)
    echo json_encode([
        'success' => true,
        'source'  => 'mock',
        'prices'  => getMockPrices()
    ]);
    exit;
}

// ---- Optional single-crop filter ----
$cropFilter = isset($_GET['crop']) ? trim($_GET['crop']) : null;

try {
    if ($cropFilter) {
        $stmt = $pdo->prepare("
            SELECT crop_name, price_per_kg, change_pct, volume_ton, updated_at
            FROM crop_prices
            WHERE crop_name = ?
            ORDER BY updated_at DESC
            LIMIT 1
        ");
        $stmt->execute([$cropFilter]);
    } else {
        $stmt = $pdo->query("
            SELECT crop_name, price_per_kg, change_pct, volume_ton, updated_at
            FROM crop_prices
            ORDER BY updated_at DESC
        ");
    }

    $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'   => true,
        'source'    => 'database',
        'timestamp' => date('Y-m-d H:i:s'),
        'prices'    => $prices
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'خطأ في جلب الأسعار'
    ]);
}

// ---- Mock data (fallback when DB is offline) ----
function getMockPrices(): array {
    return [
        ['crop_name' => 'طماطم',   'price_per_kg' => 89,  'change_pct' =>  1.5, 'volume_ton' => 12,  'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'بطاطس',   'price_per_kg' => 56,  'change_pct' => -0.8, 'volume_ton' => 8,   'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'ذرة',     'price_per_kg' => 245, 'change_pct' =>  3.2, 'volume_ton' => 20,  'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'بصل',     'price_per_kg' => 42,  'change_pct' =>  2.1, 'volume_ton' => 5,   'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'فلفل',    'price_per_kg' => 112, 'change_pct' => -1.3, 'volume_ton' => 3,   'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'قمح',     'price_per_kg' => 380, 'change_pct' =>  0.5, 'volume_ton' => 50,  'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'برتقال',  'price_per_kg' => 65,  'change_pct' =>  4.0, 'volume_ton' => 7,   'updated_at' => date('Y-m-d H:i:s')],
        ['crop_name' => 'فراولة',  'price_per_kg' => 180, 'change_pct' =>  5.2, 'volume_ton' => 2,   'updated_at' => date('Y-m-d H:i:s')],
    ];
}
