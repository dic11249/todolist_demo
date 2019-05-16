<?php
header('Content-Type: application/json; charset=utf-8');
include('../../db.php');
try{
	$pdo = new PDO("mysql:host=$db[host];dbname=$db[dbname];port=$db[port];charset=$db[charset]", $db['username'], $db['password']);
	// echo "連線成功";
}catch(PDOException $e) {
	echo "Database connection failed.";
	exit;
}


$sql = 'UPDATE todos SET content=:content where id=:id';

$statement = $pdo->prepare($sql);
$statement->bindValue(':content', $_POST['content'], PDO::PARAM_STR);
$statement->bindValue(':id', $_POST['id'], PDO::PARAM_INT);
$result = $statement->execute();

if(!$result) {
	echo 'error';
}