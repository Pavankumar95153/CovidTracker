import {useState,useEffect} from 'react'
import{ FormControl,MenuItem,Select,Card,CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import './App.css';
import Map from './Map'
import Table from './Table'
import { sortData } from './util';
import LineGraph from './LineGrapph';



function App() {
  const [countries,setCountries]= useState([]);
  const [country,setCountry]= useState('worldwide');
  const [countryInfo, setCountryinfo] = useState({});
  const [tableData,setTableData] = useState([])
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=> response.json())
    .then(data =>{
      setCountryinfo(data)
    })
  
  }, [])
  //https://disease.sh/v3/covid-19/countries  
  useEffect(() => {
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>{
        const countries= data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }
        ));
        const sortedData= sortData(data)
        setTableData(sortedData); 
        setCountries(countries);
        

      });
      };
    getCountriesData();
  }, []);

  const onCountryChange = (event) =>{
    const countryCode= event.target.value;
    setCountry(countryCode);
    const url = 
    countryCode === "WorldWide"
     ?"https://disease.sh/v3/covid-19/all"
     : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
     fetch(url)
 .then(response => response.json())
 .then(data =>{
   setCountry(countryCode)
  setCountryinfo(data);
 })  
};
  return (
    
    <div className="App">
      <div className="app__left">
      <div className="app_header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className= "app__dropdown"> 
      <Select variant = "outlined" onChange={onCountryChange} value={country}>
        <MenuItem value = "worldwide">WorldWide</MenuItem>
        {
          countries.map(country=> (<MenuItem value ={country.value}>{country.name}</MenuItem>))
        }
        </Select>
        </FormControl>
      </div>
      <div className="app__stats">
      <InfoBox title ="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
      <InfoBox title ="Record" cases ={countryInfo.todayRecovered} total={countryInfo.recovered}/>
      <InfoBox title = "Deaths" cases ={countryInfo.todayDeaths} total={countryInfo.deaths}/>
      </div>
      <Map/>
      </div>
   <Card className="app__right">
     <CardContent>
       <h3> Live cases by country</h3>
       <Table countries={tableData}/>
       <LineGraph/>
       <h3> Worldwide new cases</h3>
     </CardContent>

   </Card>
    </div>
  );
}

export default App;
