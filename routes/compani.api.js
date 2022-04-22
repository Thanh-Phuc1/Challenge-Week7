const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const  sendResponse  = require("../helpers/utility");

const loadData = (next) => {
try {
      const response = fs.readFileSync('./dataTest.json','utf-8')
      return JSON.parse(response);
} catch (error) {
  next(error)
}
};
const throwError = (message, status) => {
  const error = { message, status };
  throw error;
};
const searchCity = (jobs, city) => {
  const listCityQuery = city.split(",");
  const numberQuery = listCityQuery.length;
  const objCompanies = {};
  listCityQuery.forEach((cityQuery) => {
      jobs.forEach(( {city, companyId}) => {
          if (city === cityQuery) {
              const array = objCompanies[companyId] 
              ?? [];
              array.push(cityQuery)
              objCompanies[companyId] = array;
          }
      })
  });
  const listIdCompanies = Object.keys(objCompanies);
  const totalList = listCityQuery
  .filter((id) => objCompanies[id].length === numberQuery);
  return totalList
};



router.get("/", (req,res,next) => {
  const { page = 1, city } = req.query;
  const data = loadData(next);
  // console.log(data)
  let dataCompanies = data.companies;
  // console.log(dataCompanies.length)
  if (city) {
    const searchData =searchCity(data.jobs, city)
    dataCompanies = dataCompanies.filter(({id}) => searchData.includes(id))
  }
  const setof = 20 * (page - 1);
  dataCompanies = dataCompanies.slice(setof, 20 * page)
  sendResponse(200,data,"Companies List", res, next)
});

router.post("/", (req,res,next) => {
  const  { id, name, benefits, description } = req.body;
  if (!id || !name || !description || !benefits)
  throwError("Missing in4", 400)
  const newCompany = {
    id,
    name,
    benefits: {
      gym: false,
      remote: false,
      sickLeave: false,
      freeLunch: false,
      fourOhOneK: false,
      freeDinner: false,
      stockOptions: false,
      companyPhone: false,
      lifeInsurance: false,
      freeBreakfast: false,
      maternityLeave: false,
      injuryInsurance: false,
      healthInsurance: false,
      dentalInsurance: false,
      disabilityInsurance: false,
    },
    description,
    ratings: [],
    jobs: [],
    numOfJobs: 0,
    numOfRatings: 0,
  };
  const listBenefits = Object.keys(newCompany.benefits)
  listBenefits.forEach((key) => {
    if (benefits[key]) newCompany.benefits[key] = true;
  });
  const data = loadData();
  data.companies.push(newCompany);
  fs.writeFile('./dataTest.json', JSON.stringify(data),'utf-8', (err) => {});
    sendResponse(200,data,"Add new company",res,next)
})

module.exports = router;