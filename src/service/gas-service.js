import { databaseQuery } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { addGasValidation, deleteGasStokValidation, downloadGasSalesHistoryValidation, downloadGasStokHistoryValidation, searchGasSalesHistoryValidation, searchGasStokHistoryValidation, updatePriceGasValidation } from "../validation/gas-validation.js"
import { validate_object } from "../validation/validation-util.js"
import mysql from "mysql2/promise"

const update = async (request) => {
    const requestUpdate = validate_object(updatePriceGasValidation, request.body);
    
    const namaGas = 'LPG3KG';

    let query = "INSERT INTO `gas`(`nama`, `harga_beli`, `harga_jual`, `tanggal`) VALUES (?,?,?,?)"
    let params = [namaGas, requestUpdate.priceBuy, requestUpdate.priceSell, requestUpdate.inputDate];
    const [resultData, field] = await databaseQuery(query, params)

    if(resultData.affectedRows < 1){
        throw new ResponseError(400, "Gagal mengupdate harga");
    }

    query = "UPDATE "

    return "Berhasil merubah harga"
}

const stok = async (request) => {
    const namaGas = 'LPG3KG';

    let query = "SELECT (SELECT a.jumlah FROM `detail_pengiriman` AS a JOIN `gas` AS b ON a.id_gas = b.id WHERE b.nama = ? ORDER BY a.id DESC LIMIT 1) - (SELECT SUM(a.jumlah) FROM `detail_pembelian` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id_detail_pengiriman=b.id AND b.id_gas = c.id WHERE c.nama = ? GROUP BY a.id_detail_pengiriman ORDER BY a.id_detail_pengiriman DESC LIMIT 1  ) AS stok"
    let params = [namaGas, namaGas];
    const [resultData, field] = await databaseQuery(query, params)

    console.log(resultData)

    query = "SELECT harga_beli, harga_jual FROM `gas` WHERE nama=? ORDER BY id DESC LIMIT 1";
    params = [namaGas];
    const [resultData2, field2] = await databaseQuery(query, params)


    return {
        stok: resultData.at(0).stok,
        hargaBeli: resultData2.at(0).harga_beli,
        hargaJual: resultData2.at(0).harga_jual,
    }

    
    // // query = "SELECT SUM(a.jumlah) FROM `detail_Pembelian` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS b ON a.id_detail_pengiriman=b.id AND b.id_gas = c.id WHERE c.nama = ? ";
    // const 

}

const add = async (user, request) => {
    // console.log(request)
    const addRequest = validate_object(addGasValidation, request);
    const idGas = 31200;
    const namaGas = 'LPG3KG';

    let query = "SELECT (SELECT a.jumlah FROM `detail_pengiriman` AS a JOIN `gas` AS b ON a.id_gas = b.id WHERE b.nama = ? ORDER BY a.id DESC LIMIT 1) - (SELECT SUM(a.jumlah) FROM `detail_pembelian` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id_detail_pengiriman=b.id AND b.id_gas = c.id WHERE c.nama = ? GROUP BY a.id_detail_pengiriman ORDER BY a.id_detail_pengiriman DESC LIMIT 1  ) AS stok"
    let params = [namaGas, namaGas]

    const [resultData4, field4] = await databaseQuery(query, params)
    console.log(resultData4)
    if (resultData4.at(0).stok > 0) {
        throw new ResponseError(400, "Tidak bisa menambah stok sebelum habis")
    }
    console.log("Hayo")


    query = "SELECT id FROM `gas` AS a WHERE a.nama = ? ORDER BY a.id DESC LIMIT 1";
    params = [namaGas]
    const [resultData3, field3] = await databaseQuery(query, params)
    // console.log(resultData, field)
    if (resultData3.length == 0) {
        throw new ResponseError(400, "Gagal menambah stok")
    }



    query = "INSERT INTO `pengiriman_gas`(`tanggal`, `informasi`, `id_user`) VALUES (?,?,?)";
    params = [addRequest.inputDate, addRequest.information ?? null, user.id]
    const [resultData, field] = await databaseQuery(query, params)
    console.log(resultData, field)
    if (resultData.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah stok")
    }


    query = "INSERT INTO `detail_pengiriman`(`id_pengiriman`, `jumlah`, `id_gas`) VALUES (?,?,?)";
    params = [resultData.insertId, addRequest.countStok, resultData3.at(0).id]
    console.log(params)
    const [resultData2, field2] = await databaseQuery(query, params)
    if (resultData2.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah stok")
    }
    return "Berhasil menambah Stok";
}

const salesHistory = async (user, request) => {
    const requestHistory = validate_object(searchGasSalesHistoryValidation, request)
    const idGas = 31200;
    const namaGas = 'LPG3KG';
    
    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    console.log(resultData2)
    const totalItem = resultData2.at(0).totalItem
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id WHERE c.nama = ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas]
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

const deleteStok = async (stokId) => {
    stokId = validate_object(deleteGasStokValidation, stokId);


    
    let query = "SELECT id FROM `pengiriman_gas` WHERE id=?"
    let params = [stokId]

    const [resultData, field] = await databaseQuery(query, params)
    // console.log(resultData4)
    if (resultData.length !== 1) {
        throw new ResponseError(400, "Data tidak ada")
    }

    query = "SELECT id FROM `pengiriman_gas` WHERE id>? ORDER BY id ASC LIMIT 1"
    params = [stokId]

    const [resultData2, field2] = await databaseQuery(query, params)
    // console.log(resultData4)
    if (resultData2.length != 0) {
        throw new ResponseError(400, "Tidak bisa dihapus")
    }

    query = "DELETE FROM `pengiriman_gas` WHERE id = ?"
    params = [stokId]

    const [resultData3, field3] = await databaseQuery(query, params)
    // console.log(resultData4)
    if (resultData2.affectedRows < 1) {
        throw new ResponseError(400, "Error");
    }

    return "Berhasil dihapus"
}

const printSalesHistory = async (user, request) => {
    const requestHistory = validate_object(downloadGasSalesHistoryValidation, request)
    const idGas = 31200;
    const namaGas = 'LPG3KG';
    
    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id=b.id_pembelian AND b.id_gas=c.id WHERE c.nama = ? ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_user = e.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_user = e.id WHERE c.nama = ? ORDER BY a.id DESC";
        params = [namaGas]
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
    const namaGas = 'LPG3KG';

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    console.log(resultData2)
    const totalItem = resultData2.at(0).totalItem
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas]
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
    const namaGas = 'LPG3KG';

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if(requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate){
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if(requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.startDate]
    }

    if(requestHistory.endDate && !requestHistory.startDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    } 
    if(!requestHistory.startDate && !requestHistory.endDate){
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, c.nama AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman AND b.id_gas=c.id WHERE c.nama = ? ORDER BY a.id DESC";
        params = [namaGas]
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
    printSalesHistory,
    stok,
    update,
    deleteStok
}