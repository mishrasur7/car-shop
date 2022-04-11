import React, {useEffect, useState} from "react";
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Addcar from "./Addcar";
import Editcar from "./Editcar";

function Carlist() {

    const[cars, setCars] = useState([]); 
    const [open, setOpen] = useState(false); 

    //fetch cars after the first render
    useEffect(() => { fetchCars(); }
       , []);

    const fetchCars = () => {
        fetch(process.env.REACT_APP_API_URL)
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (link) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            fetch(link, {method: 'DELETE'})
            .then(response => {
                if(!response.ok) {
                    alert('Something went wrong in deletion') 
                } else {
                    setOpen(true); 
                    fetchCars(); 
                }
            })
            .catch(err => console.error(err))
        }    
    }

    const addCar = (newCar) => {
        fetch(process.env.REACT_APP_API_URL, {
            method:'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(newCar)
        })
        .then(response => {
            if(response.ok) {
                fetchCars(); 
            }
            else {
                alert('Something went wrong!'); 
            }
        })
        .catch(err => console.error(err))
    }

    const updateCar = (updatedCar, link) => {
        fetch(link, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify(updatedCar)
        })
        .then(response => {
            if(response.ok) {
                fetchCars(); 
            } else {
                alert('Something went wrong'); 
            }
        })
        .catch(err => console.error(err))

    }

    const [columns] = useState([
        {field: 'brand', sortable : true, filter: true}, 
        {field: 'model', sortable : true, filter: true},
        {field: 'color', sortable : true, filter: true, width: 150}, 
        {field: 'fuel', sortable : true, filter: true, width: 120}, 
        {field: 'year', sortable : true, filter: true, width: 120}, 
        {field: 'price', sortable : true, filter: true},
        {
            headerName: '', 
            width: 100, 
            field: '_links.self.href', 
            cellRenderer: params => <Editcar params={params} updateCar={updateCar}/>
        },
        {   
            width: 100,
            headerName: '',
            field: '_links.self.href',     
            cellRenderer: params => 
                <IconButton onClick={() => deleteCar(params.value)}>
                    <DeleteIcon color="error"/>
                </IconButton>
        }
    ])
    return (
        <React.Fragment>
            <Addcar addCar={addCar}/>
             <div className="ag-theme-material" style={{ height: 600, width: '90%'}}>
                <AgGridReact
                columnDefs={columns}
                rowData= {cars}
                pagination={true}
                paginationPageSize={10}
                suppressCellFocus={true}
                />
             </div>
             <Snackbar 
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Car was deleted successfully"
             />
        </React.Fragment>
    ); 
}

export default Carlist; 