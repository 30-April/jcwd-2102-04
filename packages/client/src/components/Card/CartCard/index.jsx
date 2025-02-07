import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Button, HStack, Icon, IconButton, Input, Stack, Text, Tooltip, useToast, VStack } from "@chakra-ui/react"
import Image from "next/image"
import { useEffect } from "react"
import { useState } from "react"
import { HiMinus, HiPlus } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { axiosInstance } from "../../../library/api"
import render_types from "../../../redux/reducers/types/render"


const CartCard = (props) => {
    const { product_name, product_price, product_category, quantity, image_url, product_stock, product_id, user_id, cart_id } = props
    const [ counter, setCounter ] = useState(quantity)
    const toast = useToast()

    const autoRender = useSelector((state) => state.render)
    const dispatch = useDispatch()

    const totalQuantity = async() => {
        try {
            await axiosInstance.patch("/cart/quantity", {
                params : {
                    cart_id: cart_id,
                    quantity: counter,
                    user_id: user_id
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deletProductCart = async() => {
        try {
            await axiosInstance.delete("/cart/", {params: { product_id: product_id, user_id: user_id}}).then(() => {
                toast({
                    title: `${product_name} has been deleted from your cart`,
                    status: 'warning',
                    duration: 1000
                })

                dispatch({
                    type: render_types.AUTO_RENDER,
                    payload: {
                        value : !autoRender.value
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dispatch({
            type: render_types.AUTO_RENDER,
            payload: {
                value : !autoRender.value
            }
        })
    } ,[counter])

    return (
        <HStack borderBottom='1px solid #B7B7B7' p={1}>
            <Image
                src={`http://${image_url}`}
                alt=""
                width={150}
                height={150}
            />
            <VStack w='full' h='full'>
                <HStack  w='full' justify='space-between'>
                    <Text fontWeight='bold' fontSize={18}>{product_name}</Text>
                    <HStack color ='red' cursor='pointer' fontSize={13} onClick={() => {deletProductCart()}}>
                        <Text>delete</Text>
                        <DeleteIcon/>
                    </HStack>
                </HStack>

                <VStack w='full' h='full'>
                    <HStack w='full' align='start' borderBottom='1px solid black' paddingBottom={2}>
                        <Text>{Number(product_price).toLocaleString('id', { style: 'currency', currency: 'IDR' })}</Text>
                        <Text px={1} fontWeight='bold'>X</Text>
                        <HStack>
                            <IconButton 
                                icon={<HiMinus/>} 
                                onClick={() => {setCounter( counter > 0 ? counter - 1 : 0); totalQuantity()}} 
                                size='sm'
                            />
                            
                            <Input value={counter} type='number'w={30} mx='auto' size='xs' justifySelf='center'/>
                            { 
                                counter < product_stock ? (
                                    <IconButton
                                        icon={<HiPlus/>} 
                                        size='sm' 
                                        onClick={() => {setCounter(counter + 1); totalQuantity()}}
                                    />
                                ) :  (
                                    <Tooltip label='we out of stock' fontSize='md'>
                                        <IconButton
                                            icon={<HiPlus/>} 
                                            size='sm' 
                                            disabled='true'
                                        />
                                    </Tooltip>
                                )

                            }
                            <Text fontSize={11}>/ Stock {product_stock}</Text>
                        </HStack>
                    </HStack>
                        <HStack w='full' justify='space-between' h='full'>
                            <Text fontWeight='bold'> Harga Total</Text>
                            <Text fontWeight='bold'>{Number(product_price * counter).toLocaleString('id', { style: 'currency', currency: 'IDR' })}</Text>
                        </HStack>
                </VStack>
            </VStack>
        </HStack>
    )
}

export default CartCard