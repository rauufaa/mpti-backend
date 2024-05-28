import { databaseQuery } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { nikValidation } from "../validation/customer-validation.js"
import { validate_object } from "../validation/validation-util.js"


const cekNik = async (request) => {
    console.log("sadasdasdasd")
    const customerRequest = validate_object(nikValidation, request)

    console.log(customerRequest)
    let query = "SELECT * FROM konsumen WHERE nik=?";
    let params = [customerRequest.nik];
    let [resultUser, field] = await databaseQuery(query, params);

    if(resultUser.length == 0){
        throw new ResponseError(400, "Pelanggan tidak ditemukan")
    }

    console.log(resultUser)

    if(resultUser.at(0).tipe == "Rumah Tangga"){
        console.log("hola")
        query = "WITH raw_data as (SELECT id from pengiriman_gas ORDER BY id DESC LIMIT 1) SELECT COUNT(*) as jumlah_pembelian FROM pembelian_gas, raw_data WHERE pembelian_gas.nik_konsumen_pembelian=? AND pembelian_gas.id_pengiriman_gas=raw_data.id";
        
        let [resultCount, fieldCekup] = await databaseQuery(query, params);
        if(resultUser.at(0).jumlah_pembelian == 1){
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian")
        }
    }

    return resultUser.at(0)
}


export default {
    cekNik
}