const e = require('express')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const { Product, Product_categories, Product_description, Product_img, Product_stock, Categories, } = require('../library/sequelize')
const productController = {
    getAllProduct: async (req, res) => {
        const {page, limit , search, category, sort, orderBy, min, max } =  req.query
        console.log(req.query)
        try {
            const allProduct = await Product.findAll({
                offset: (page - 1) * limit,
                limit: limit ? parseInt(limit) : undefined,
                where :  search ? {
                    product_name : {[Op.substring] : search }
                } : {},
                include: [
                    Product_description,
                    Product_img,
                    {
                        model : Product_stock,
                        where : min&&max ? {
                            sell_price : {[Op.between] : [+min, +max]}
                        } : {},
                    },
                    { model: Product_categories,
                        include: [
                            { model: Categories,
                                where: category ? {
                                    category : `${category}`
                                } : {},
                            }
                        ],
                    }
                ],
                order: orderBy ?
                    orderBy == 'product_name' && sort ? [[orderBy, sort]]
                    : (orderBy == 'sell_price' && sort ? [[Product_stock,  orderBy, sort]] : null )
                : [['createdAt', 'DESC']]
            })

            return res.status(200).json({
                message: "All product has fetched",
                result: allProduct
            })

        } catch (error) {
            console.log(error);
        }
    },

    getProductById: async (req, res) =>{
        try{
            const { product_id } = req.params

            const findProduct = await Product.findOne(
                {
                    where: {
                        id : product_id,
                    },

                    include: [
                        Product_description, 
                        
                        Product_img, 
    
                        {
                            model : Product_stock,
                        },
                        
                        {
                            model: Product_categories,
                            include: [{model: Categories}]
                        }
                    ],
                }
            )

            return res.status(200).json({
                message: `fatched the post from post_id = ${product_id}`,
                result: findProduct
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const result = await Categories.findAll({})
            
            return res.status(200).json({
                message: `fatched all category`,
                result: result
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.toString()
            })
        }
    },

    getAllProductName: async (req, res) => {
        try {
            const result = await Product.findAll({
                include: [ Product_stock ]
            })

            return res.status(200).json({
                message: `fatched all category`,
                result: result
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.toString()
            })
        }
    }
}

module.exports = productController