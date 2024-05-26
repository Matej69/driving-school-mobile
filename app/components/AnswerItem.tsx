import { Text, TouchableOpacity, View } from "react-native"

import React from "react"
import { Ionicons } from "@expo/vector-icons"
import colors from "../colors"


type AnswerItemProps = {
    text: string,
    icon?: 'checkmark' | 'close' 
    checkboxFillColor?: string,
    itemBorderColor?: string,
    checkboxBorderColor?: string,
    checked?: boolean,
    onClick?: () => void
}

export const AnswerItem = ({ text, icon, itemBorderColor, checkboxFillColor, checkboxBorderColor, checked = false, onClick = () => {} }: AnswerItemProps) => {


    return (
        <TouchableOpacity onPress={onClick} className="rounded p-1 flex-row items-center" style={{ borderWidth: 1.5, borderColor: itemBorderColor}}>
            <View className="p-1">
                <View className="w-10 h-10 rounded-md justify-center" style={{ borderWidth: 1.5, backgroundColor: checkboxFillColor, borderColor: checkboxBorderColor }}>
                { checked && <Ionicons size={36} color={'white'} style={{ width: '100%' }} name={icon} />}
                { /* !clickable && <Ionicons size={36} color={'white'} style={{ width: '100%' }} name="checkmark" /> */}
                </View>
            </View>
            <View className='ml-1'></View>
            <Text>{text}</Text>
        </TouchableOpacity>
    ) 
}