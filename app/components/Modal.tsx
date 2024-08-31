import React, { ReactElement } from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"
import colors, { disabled } from "../colors"

type DsModalProps = {
    visible: boolean,
    title: string,
    subtitle: string,
    actions: ReactElement<typeof TouchableOpacity>[]
}

export const DsModal = (p: DsModalProps) => {
    return(
        <Modal transparent={true} visible={p.visible} animationType="fade"> 
        <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', width: '100%', height: '100%'}}>
          <View style={{ borderRadius: 8, top: '10%', backgroundColor: colors["section-item"], padding: 8, margin: 6}}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.base }}>Završi ispit</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: disabled }}>Završi ispit i pogledaj rezultat</Text>
            <View style={{ marginTop: 26, display: 'flex', flexDirection: 'row', gap: 8}}>
                { p.actions?.map((ActionElement, i) => {
                    return(
                        <View key={i} style={{ flex: 1 }}>
                            {ActionElement}
                        </View>
                    )
                }) }
            </View>
          </View>
        </View>
      </Modal>
    )
}