const company_setting = require("../model/setting");

const company_datails = async (req, res) => {
  try {
    const { company_name, office_hours, rate, tax_rate } = req.body;

    if (company_name=="" || office_hours=="" || rate=="" || tax_rate=="") {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await company_setting.create({company_name,office_hours,rate,tax_rate,});

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const company_data = async (req, res) => {
  try {
const company = await company_setting.findOne().sort({ _id: -1 });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company details not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: company
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const data_update = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await company_setting.findByIdAndUpdate(id,req.body,{new:true});

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};  

module.exports = { company_datails,company_data,data_update };