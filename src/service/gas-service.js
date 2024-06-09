import { databaseQuery } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { addGasValidation, downloadGasSalesHistoryValidation, downloadGasStokHistoryValidation, searchGasSalesHistoryValidation, searchGasStokHistoryValidation } from "../validation/gas-validation.js"
import { validate_object } from "../validation/validation-util.js"
import mysql from "mysql2/promise"

const list = async () => {

}

const stok = async (request) => {

}

const add = async (request) => {
    // console.log(request)
    const addRequest = validate_object(addGasValidation, request.body);
    const idGas = 31200;



    let query = "INSERT INTO `pengiriman_gas`(`tanggal`, `informasi`, `username_input_pengiriman`) VALUES (?,?,?)";
    let params = [addRequest.inputDate, addRequest.information ?? null, request.user.username]
    const [resultData, field] = await databaseQuery(query, params)
    console.log(resultData, field)
    if (resultData.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah stok")
    }


    query = "INSERT INTO `detail_pengiriman`(`id_pengiriman`, `jumlah`, `id_gas`) VALUES (?,?,?)";
    params = [resultData.insertId, addRequest.countStok, idGas]
    console.log(params)
    const [resultData2, field2] = await databaseQuery(query, params)
    if (resultData2.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah stok")
    }
    return true;
}

const salesHistory = async (user, request) => {
    const requestHistory = validate_object(searchGasSalesHistoryValidation, request)
    const idGas = 31200;
    
    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? ORDER BY a.id DESC";
        params2 = [idGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    console.log(resultData2)
    const totalItem = resultData2.at(0).totalItem
    if (Math.ceil(totalItem / requestHistory.size) < requestHistory.page) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [idGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);

        params = [idGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [idGas]
    }



    const [resultData, field] = await databaseQuery(query, params)



    console.log(resultData)



    // const lastId = resultData.at(-1).id




    // const [resultData, field] = await databaseQuery(query, params)
    console.log(resultData, field)
    // if (resultData.length == 0) {
    //     throw new ResponseError(400, "Gagal mengambil stok")
    // }
    const paging = {}
    paging.page = requestHistory.page
    paging.total_item = totalItem
    paging.total_page = Math.ceil(totalItem / requestHistory.size)

    if (requestHistory.page > 1) {
        paging.prev = requestHistory.page - 1
    }

    if (requestHistory.page < Math.ceil(totalItem / requestHistory.size)) {
        paging.next = requestHistory.page + 1
    }

    return {
        data: resultData,
        dataSold: {
            countSold: resultData2.at(0).totalTerjual,
            revenue: resultData2.at(0).totalKeuntungan
        },
        paging: paging
    }
}

const printSalesHistory = async (user, request) => {
    const requestHistory = validate_object(downloadGasSalesHistoryValidation, request)
    const idGas = 31200;
    
    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*b.harga) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE b.id_gas = ? ORDER BY a.id DESC";
        params2 = [idGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params = [idGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";

        params = [idGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*b.harga) AS totalBayar, b.harga AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.username_input_pembelian = d.username AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.nik_konsumen_pembelian = e.nik WHERE b.id_gas = ? ORDER BY a.id DESC";
        params = [idGas]
    }



    const [resultData, field] = await databaseQuery(query, params)



    console.log(resultData)



    // const lastId = resultData.at(-1).id




    // const [resultData, field] = await databaseQuery(query, params)
    console.log(resultData, field)
    // if (resultData.length == 0) {
    //     throw new ResponseError(400, "Gagal mengambil stok")
    // }
    // const paging = {}
    // paging.page = requestHistory.page
    // paging.total_item = totalItem
    // paging.total_page = Math.ceil(totalItem / requestHistory.size)

    // if (requestHistory.page > 1) {
    //     paging.prev = requestHistory.page - 1
    // }

    // if (requestHistory.page < Math.ceil(totalItem / requestHistory.size)) {
    //     paging.next = requestHistory.page + 1
    // }

    return {
        data: resultData,
        dataSold: {
            countSold: resultData2.at(0).totalTerjual,
            revenue: resultData2.at(0).totalKeuntungan
        },
        // paging: paging
    }
}

const history = async (user, request) => {
    const requestHistory = validate_object(searchGasStokHistoryValidation, request);
    const idGas = 31200;

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? ORDER BY a.id DESC";
        params2 = [idGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    console.log(resultData2)
    const totalItem = resultData2.at(0).totalItem
    if (resultData2.length == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [idGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);

        params = [idGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [idGas]
    }



    const [resultData, field] = await databaseQuery(query, params)



    console.log(resultData)

    // const lastId = resultData.at(-1).id




    // const [resultData, field] = await databaseQuery(query, params)
    console.log(resultData, field)
    // if (resultData.length == 0) {
    //     throw new ResponseError(400, "Gagal mengambil stok")
    // }
    const paging = {}
    paging.page = requestHistory.page
    paging.total_item = totalItem
    paging.total_page = Math.ceil(totalItem / requestHistory.size)

    if (requestHistory.page > 1) {
        paging.prev = requestHistory.page - 1
    }

    if (requestHistory.page < Math.ceil(totalItem / requestHistory.size)) {
        paging.next = requestHistory.page + 1
    }

    return {
        data: resultData,
        paging: paging
    }
}

const printHistory = async (user, request) => {
    const requestHistory = validate_object(downloadGasStokHistoryValidation, request);
    const idGas = 31200;

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [idGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? ORDER BY a.id DESC";
        params2 = [idGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params = [idGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params = [idGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";

        params = [idGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.username_input_pengiriman = d.username AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE b.id_gas = ? ORDER BY a.id DESC";
        params = [idGas]
    }



    const [resultData, field] = await databaseQuery(query, params)



    console.log(resultData)

    // const lastId = resultData.at(-1).id




    // const [resultData, field] = await databaseQuery(query, params)
    console.log(resultData, field)
    // if (resultData.length == 0) {
    //     throw new ResponseError(400, "Gagal mengambil stok")
    // }
    // const paging = {}
    // paging.page = requestHistory.page
    // paging.total_item = totalItem
    // paging.total_page = Math.ceil(totalItem / requestHistory.size)

    // if (requestHistory.page > 1) {
    //     paging.prev = requestHistory.page - 1
    // }

    // if (requestHistory.page < Math.ceil(totalItem / requestHistory.size)) {
    //     paging.next = requestHistory.page + 1
    // }

    return {
        data: resultData,
    }
}

export default {
    add,
    history,
    salesHistory,
    printHistory,
    printSalesHistory
}