import { getPagination } from "../utils/pagination.js";
import { getSearchMatch } from "../utils/search.js";
import categorymodel from "../models/category.js"

export async function createCategory(req, res) {
  try {
    const { name, description, image} = req.body;
    const newCategory = await categorymodel.create({  
      name,
      description,
      image,
      });
    
    res.status(201).json({
      success: true,
      data: newCategory,
      message: " category created successfully"
    });
  }
  catch (error) {
    if (error.code === 11000) {
  return res.status(400).json({
    success: false,
    message: "Category already exists"
  });
  }
    res.status(500).json({
      success: false,
      message: error.message
    });
}
}

export async function getCategory(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "" } = req.query;

    const matchStage = getSearchMatch(search, "name");

    const categories = await categorymodel
      .find(matchStage)
      .skip(skip)
      .limit(limit);

    const total = await categorymodel.countDocuments(matchStage);

    res.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const categoryData= await categorymodel.findById(id);
    if (!categoryData) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).json({
      success: true,
      data: categoryData,
      message: "category found successfully"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateCategoryById(req, res) {
  try {
    const { id } = req.params;   

    const updateCategory = await categorymodel.findByIdAndUpdate(id, req.body, {new:true});
     if (!updateCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).json({
      success: true,
      data : updateCategory,
      message: " updated successfully"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function deleteCategoryById(req, res) {
  try {
    const { id } = req.params;
    const categoryDelete = await categorymodel.findByIdAndDelete(id);
   
    if (!categoryDelete) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
     return res.status(201).json({
      success: true,
      data : categoryDelete,
      message: "Deleted successfully"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}