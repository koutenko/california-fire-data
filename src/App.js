import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Select, MenuItem, InputLabel, OutlinedInput, FormControl } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  SelectDisplayProps: {
    style: {
      height: 70,
      top: 10,
    },
  },
};

const App = () => {
  const [fires, setFire] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [select, setSelect] = useState("");
  const [tableData, setTableData] = useState([]);

  const getFireData = async () => {
    try {
      const data = await axios.get(
        "https://www.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=true"
      );

      const unique = [...new Set(data.data.map(item => item.County))];
      console.log(unique);
      console.log('DATA: ', data.data);
      setFire(data.data);
      setTableData(data.data);
      setSelectList(unique)
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    setSelect(event.target.value);
    let _vals = event.target.value
      ? fires.filter(f => f.County === event.target.value)
      : fires;
    setTableData(_vals);
  };

  useEffect(() => {
    getFireData();
  }, []);

  return (
    <div className="App">
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel>County</InputLabel>
        <Select
          input={<OutlinedInput label='County' />}
          value={select}
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {selectList.map((item, index) => {
            return (
            <MenuItem key={index + 1} value={item}>{item}</MenuItem>
            )
          })}
           <MenuItem key={0} value={''}>All Counties</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell><h3>County</h3></TableCell>
              <TableCell><h3>Name</h3></TableCell>
              <TableCell><h3>Acres Burned</h3></TableCell>
              <TableCell><h3>Percent Contained</h3></TableCell>
              <TableCell><h3>Is Active</h3></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData
              .filter((item) => {
                if (select === "") {
                  return item;
                } else if (
                  item.County === select.toLowerCase()
                ) {
                  console.log(item.County.toLowerCase());
                  console.log(select.toLowerCase())
                  return item.filter(d => d.County.includes(select));
                } else {
                  return item;
                }
              })
              .map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.County}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.Name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.AcresBurned ? item.AcresBurned : '—'}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.PercentContained ? item.PercentContained : '—'}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {JSON.stringify(item.IsActive)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;