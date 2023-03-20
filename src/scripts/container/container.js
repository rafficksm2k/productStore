import React, { Component, useState, useMemo } from 'react';
import Table from '../components/table';
import Edit from '../components/edit';
import Search from '../components/search';
import Pagination from '../components/pagination';
import Upload from '../components/upload';
import Header from '../components/header';

function Container(props) {

    let PageSize = 10;
    const [products, setProducts] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [tableViewProducts, setTableViewProducts] = useState([]);
    const [header, setHeader] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [editTable, setEditTable] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [tableSize, setTableSize] = useState(0);

    function csvToArr(stringVal, splitter) {
        const [keys, ...rest] = stringVal.trim().split("\n").map((item) => item.split(splitter));
        const formedArr = rest.map((item) => {
            const object = {};
            keys.forEach((key, index) => (object[key] = item.at(index)));
            return object;
        });
        return formedArr;
    }

    function convert(string) {
        let lines = string.split("\n");
        let result = [];
        let headers;
        headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            if (lines[i] == undefined || lines[i].trim() == "") {
                continue;
            }
            let words = lines[i].split(",");
            for (var j = 0; j < words.length; j++) {
                obj[headers[j].trim().replace(/(\r\n|\n|\r)/gm, "")] =
                    words[j].replace(/(\r\n|\n|\r)/gm, "");
            }
            result.push(obj);
        }
        return result;
    }

    function handleChange(newValue, storeId, sku) {
        setShowTable(newValue);
        setSelectedProduct(products.find((product) => {
            return (storeId === product.StoreID && sku === product.SKU);
        }));
        setEditTable(true);
    }

    function uploadFile() {
        var fileUpload = document.getElementById("fileUpload");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    const csvArray = convert(e.target.result.trim());
                    setProducts(csvArray);
                    setTableSize(csvArray.length);
                    const firstPageIndex = (currentPage - 1) * PageSize;
                    const lastPageIndex = firstPageIndex + PageSize;
                    setFilteredProduct(csvArray);
                    setTableViewProducts(csvArray.slice(firstPageIndex, lastPageIndex));

                    let headerArr = [];
                    Object.keys(csvArray[0]).map((key) => (
                        headerArr.push(key)
                    ));
                    setHeader(headerArr);
                    setShowTable(true);
                    setEditTable(false);
                }
                reader.readAsText(fileUpload.files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    }

    function onUpdate(updatedValue, event) {
        if (event === 'update') {
            const currentIndex = products.findIndex((product) => (product.StoreID === updatedValue.StoreID && product.SKU === updatedValue.SKU));
            const newProducts = [...products];
            newProducts[currentIndex] = updatedValue;
            setProducts(newProducts);
            defaultTabelViewData(newProducts);
        }
        setShowTable(true);
        setEditTable(false);
    }

    function onCancel() {
        setShowTable(true);
        setEditTable(false);
    }

    function uploadNew() {
        setShowTable(false);
        setEditTable(false);
    }

    const onSearch = (key, value) => {
        // Avoid filter for empty string
        if (!value) {
            defaultTabelViewData();
            return;
        }
        const filteredData = products.filter(
            (product) => product[key].toLowerCase().includes(value.toLowerCase())
        );
        setTableSize(filteredData.length);
        defaultTabelViewData(filteredData);
    }

    function defaultTabelViewData(value) {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        if (value) {
            setFilteredProduct(value);
            setTableViewProducts(value.slice(firstPageIndex, lastPageIndex));
        } else {
            setFilteredProduct([]);
            setTableViewProducts(products.slice(firstPageIndex, lastPageIndex));
            setTableSize(products.length);
        }
    }

    function onPageChange(page) {
        setCurrentPage(page);

        const firstPageIndex = (page-1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        console.log('page----', page);
        console.log('filteredProduct====', products);
        console.log('firstPageIndex===', firstPageIndex);
        console.log('lastPageIndex===', lastPageIndex);
        setTableViewProducts(filteredProduct.slice(firstPageIndex, lastPageIndex));
        // setFilteredProduct(products.slice(firstPageIndex, lastPageIndex));
    }

    return (
        <React.Fragment>
            <Header />
            <hr />
            { !showTable && <Upload uploadFile={() => uploadFile()} />}
            { showTable && <Search onSearch={onSearch} uploadNew={uploadNew} />}
            <hr />
            { showTable && <Table productHeader={header} products={tableViewProducts} handleChange={handleChange} />}
            { showTable &&
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={tableSize}
                    pageSize={PageSize}
                    onPageChange={page => onPageChange(page)}
                />}
            {editTable && <Edit selectedProduct={selectedProduct} onUpdate={onUpdate} />}

        </React.Fragment>
    );
}

export default Container;
