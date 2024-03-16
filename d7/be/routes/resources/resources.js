const express = require("express");
const resourcesModel = require("../../models/resourcesModel");

const { validationResult } = require("express-validator");

const resource = express.Router();


resource.get("/resources/isActive", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      { isActive: true },
      { "name.first": 1, "name.last": 1, isActive: 1 }
    );

    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});


resource.get("/resources/ageGreaterThan", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      { age: { $gt: 26 } },
      { "name.first": 1, "name.last": 1, age: 1, email: 1 }
    );
    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//GET age > 26 && <= 30
resource.get("/resources/ageBetween", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      {
        age: { $gt: 26, $lte: 30 },
      },
      {
        "name.first": 1,
        "name.last": 1,
        age: 1,
      }
    );

    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});


resource.get("/resources/eyesBrownOrBlue", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      {
        eyeColor: { $in: ["brown", "blue"] },
      },
      {
        "name.first": 1,
        "name.last": 1,
        eyeColor: 1,
      }
    );

    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//GET eyeColor !== green
resource.get("/resources/eyeColorNotGreen", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      {
        eyeColor: { $ne: "green" },
      },
      {
        "name.first": 1,
        "name.last": 1,
        eyeColor: 1,
      }
    );

    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});


resource.get("/resources/eyeColorNotGreenOrBlue", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      {
        eyeColor: { $nin: ["green", "blue"] },
      },
      {
        "name.first": 1,
        "name.last": 1,
        eyeColor: 1,
      }
    );

    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});


resource.get("/resources/company", async (req, res) => {
  try {
    const resource = await resourcesModel.find(
      {
        company: "FITCORE",
      },
      {
        email: 1,
      }
    );

    res.status(200).send({
      statusCode: 200,
      totalResources: resource.length,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//GET ALL
resource.get("/resources", async (req, res) => {
  try {
    const resource = await resourcesModel.find();

    res.status(200).send({
      statusCode: 200,
      resource,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = resource;
