<?php
 
require 'Slim/Slim.php';
 
$app = new Slim();
 
$app->get('/drivers/:champ', 'getDrivers');
$app->get('/driverInfo/:id', 'driverInfo');
$app->get('/driverNews/:search', 'driverNews');

$app->get('/teams', 'getTeams');

$app->get('/races/:champ', 'getRaces');

$app->get('/news/:filter', 'getNews');
$app->get('/newsArticle/:id', 'getNewsById');

$app->get('/getFav/:type/:itemID/:userID', 'getFav');
$app->post('/addFav', 'addFav');
$app->post('/deleteFav', 'deleteFav');
/*$app->get('/wines/:id',  'getWine');
$app->get('/wines/search/:query', 'findByName');
$app->post('/wines', 'addWine');
$app->put('/wines/:id', 'updateWine');
$app->delete('/wines/:id',   'deleteWine');
*/

$app->run();

/*  ======================
    Drivers   
========================*/ 

function getDrivers($champ) {
    $sql = "select * FROM FYP_Drivers WHERE championship = :champ";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("champ", $champ);
        $stmt->execute();
        $drivers = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($drivers);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function driverInfo($id) {
    $sql = 'select * FROM FYP_Drivers WHERE driver_id = :id';
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $driver = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($driver);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function driverNews($search) {
    $search = "$search%";

    $sql = "select * FROM FYP_News WHERE title LIKE :search ";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(":search", $search);
        $stmt->execute();
        $news = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($news);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/*  ======================
    Teams   
========================*/ 

function getTeams() {
    $sql = "select * FROM FYP_Team"; 
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        //$stmt->bindParam("filter", $filter);
        $stmt->execute();
        $teams = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($teams);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/*  ======================
    Drivers   
========================*/ 

function getRaces($champ) {
    $sql = 'select * FROM FYP_Races 
                     INNER JOIN FYP_Circuits
                     ON FYP_Circuits.circuit_id = FYP_Races.track_id 
                     WHERE FYP_Races.champ = :champ';
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("champ", $champ);
        $stmt->execute();
        $races = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($races);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/*  ======================
    News    
========================*/ 

function getNews($filter) {
    $sql = 'select * FROM FYP_News WHERE release_date <= CURDATE() AND category = :filter ORDER BY release_date DESC';
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("filter", $filter);
        $stmt->execute();
        $news = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($news);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getNewsById($id) {
    $sql = 'select * FROM FYP_News WHERE release_date <= CURDATE() AND id = :id';
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $news = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($news);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/*  ======================
    Fav    
========================*/ 

function getFav($type, $itemID, $userID) {
    $sql = "select * FROM FYP_Fav WHERE fav_type = :type AND fav_item_id = :itemID AND user_id = :userID";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("type", $type);
        $stmt->bindParam("itemID", $itemID);
        $stmt->bindParam("userID", $userID);
        $stmt->execute();
        $fav = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        if($fav) {      
            echo json_encode($fav);
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addFav() {
    $request = Slim::getInstance()->request();
    $fav = json_decode($request->getBody());
    $sql = "INSERT INTO FYP_Fav (fav_type, fav_item_id, user_id) VALUES (:type, :itemID, :userID)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("type", $fav->type);
        $stmt->bindParam("itemID", $fav->itemID);
        $stmt->bindParam("userID", $fav->userID);

        $stmt->execute();
        $fav->id = $db->lastInsertId();
        $db = null;
        echo json_encode($fav);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteFav() {
    $request = Slim::getInstance()->request();
    $fav = json_decode($request->getBody());
    $sql = "DELETE FROM FYP_Fav WHERE fav_type = :type AND fav_item_id = :itemID AND user_id = :userID";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("type", $fav->type);
        $stmt->bindParam("itemID", $fav->itemID);
        $stmt->bindParam("userID", $fav->userID);

        $stmt->execute();
        $db = null;
        echo json_encode($fav);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


/*
function getWine($id) {
    $sql = "SELECT * FROM wine WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $wine = $stmt->fetchObject();
        $db = null;
        echo json_encode($wine);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
 
function addWine() {
    $request = Slim::getInstance()->request();
    $wine = json_decode($request->getBody());
    $sql = "INSERT INTO wine (name, grapes, country, region, year, description) VALUES (:name, :grapes, :country, :region, :year, :description)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $wine->name);
        $stmt->bindParam("grapes", $wine->grapes);
        $stmt->bindParam("country", $wine->country);
        $stmt->bindParam("region", $wine->region);
        $stmt->bindParam("year", $wine->year);
        $stmt->bindParam("description", $wine->description);
        $stmt->execute();
        $wine->id = $db->lastInsertId();
        $db = null;
        echo json_encode($wine);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
 
function updateWine($id) {
    $request = Slim::getInstance()->request();
    $body = $request->getBody();
    $wine = json_decode($body);
    $sql = "UPDATE wine SET name=:name, grapes=:grapes, country=:country, region=:region, year=:year, description=:description WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $wine->name);
        $stmt->bindParam("grapes", $wine->grapes);
        $stmt->bindParam("country", $wine->country);
        $stmt->bindParam("region", $wine->region);
        $stmt->bindParam("year", $wine->year);
        $stmt->bindParam("description", $wine->description);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
        echo json_encode($wine);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
 
function deleteWine($id) {
    $sql = "DELETE FROM wine WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
 
function findByName($query) {
    $sql = "SELECT * FROM wine WHERE UPPER(name) LIKE :query ORDER BY name";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $query = "%".$query."%";
        $stmt->bindParam("query", $query);
        $stmt->execute();
        $wines = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"wine": ' . json_encode($wines) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/
 
function getConnection() {
    $dbhost="localhost";
    $dbuser="root";
    $dbpass="";
    $dbname="FYP_Ginetta";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}
 
?>