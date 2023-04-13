import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { Button, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import Geocode from "react-geocode";

function ClickCounter() {
  Geocode.setApiKey("AIzaSyDIuBzZxVEGG-U7F98Zp5p9_XxzBFPHMqM");
  const countRef = doc(db, "clicks", "clicks");
  const geoRef = doc(db, "clicks", "geo");

  const [count, setCount] = useState(0);
  const [geo, setGeo] = useState({});

  const handleClick = async (newCount) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        let city, country;

        Geocode.fromLatLng(lat, long).then(async (response) => {
          for (let i = 0; i < response.results[0].address_components.length; i++) {
            for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
              switch (response.results[0].address_components[i].types[j]) {
                case "locality":
                  city = response.results[0].address_components[i].long_name;
                  break;
                case "country":
                  country = response.results[0].address_components[i].long_name;
                  break;
                default:
                  break;
              }
            }
          }
          let key = city.concat(", ", country);
          let newGeoCount = Object.keys(geo).includes(key) ? geo[key] + 1 : 1;
          await setDoc(geoRef, { ...geo, [key] : newGeoCount }).then(() => setGeo({...geo, [key] : newGeoCount }))
          }, (error) => {
            console.error(error);
          }
        );
      });
    } else {
      alert("Not Available");
    }
    await updateDoc(countRef, { count : newCount }).then(() => setCount(newCount));
  }

  useEffect(() => {
    const getClickCount = async () => {
      let data = await getDoc(doc(db, "clicks", "clicks"));
      return data;
    }
  
    const getClickGeo = async () => {
      let data = await getDoc(doc(db, "clicks", "geo"));
      return data;
    }
    getClickCount().then((data) => setCount(data.get("count")));
    getClickGeo().then((data) => {setGeo({...data.data()});});
  }, []) //run on first render

  return (
    <div className="main">
      <Button variant="contained" style={{ width: 500, height: 300, fontSize:40 }} 
        onClick={() => {handleClick(count+1)}}>CLICK TO INCREMENT</Button>
      <h1>{count} clicks so far</h1>

      <h1 style={{marginTop:"5%"}}>Distribution</h1>
      <TableContainer component={Paper} style={{width:"50%", marginLeft:"auto", marginRight:"auto"}}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(geo).sort().map(element => (
              <TableRow key={element[0]} >
                <TableCell component="th" scope="row">{element[0]}</TableCell>
                <TableCell align="right">{element[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ClickCounter