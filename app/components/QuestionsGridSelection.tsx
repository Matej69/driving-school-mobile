import { Button, StyleProp, Text, TouchableOpacity, View } from "react-native"

import React from "react"
import { Ionicons } from "@expo/vector-icons"
import colors, { background } from "../colors"


type QuestionsGridSelectionProps = {
    items: {id: number, style: StyleProp<any>}[],
    onItemClick: (id: number, index: number) => void,
    bottomActions?: JSX.Element
}

export const QuestionsGridSelection = ({items, onItemClick, bottomActions}: QuestionsGridSelectionProps) => {
    return (
        <View style={{ padding: 2}}>
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                {
                    items.map((el, i) => 
                        <TouchableOpacity key={el.id + '-' + i} onPress={() => onItemClick(el.id, i)} style={{ padding: 2, width: "16.6%" }}>
                            <View style={{...el.style, width: "100%", aspectRatio: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>{i+1}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }           
            </View>
            { bottomActions }
        </View>
    ) 
}