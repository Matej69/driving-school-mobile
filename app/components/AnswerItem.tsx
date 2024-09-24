import { Text, View } from "react-native"

import { Ionicons } from "@expo/vector-icons"
import React from "react"
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

export const AnswerItem = ({ text, icon, itemBorderColor, checkboxFillColor, checkboxBorderColor, checked = false }: AnswerItemProps) => {


    return (
        <View className="rounded p-1 flex-row items-center" style={{ borderWidth: 1.2, borderColor: itemBorderColor}}>
            <View className="p-1">
                <View className="w-10 h-10 rounded-md justify-center" style={{ borderWidth: 1, backgroundColor: checkboxFillColor, borderColor: colors.disabled }}>
                    { checked && <Ionicons size={36} color={'white'} style={{ width: '100%' }} name={icon} />}
                </View>
            </View>
            <View className='ml-1'></View>
            <Text style={{flex: 1}}>{text}</Text>
        </View>
    ) 
}