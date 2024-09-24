import { Ionicons } from "@expo/vector-icons"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import colors from "../colors"


export const usePagination = ({_pageSize, _currentPage, _itemsCount} = {
    _pageSize: 20,
    _currentPage: 1,
    _itemsCount: 300
}) => {
    const [currentPage, setCurrentPage] = useState(_currentPage)
    const [itemCount, setItemCount] = useState(_itemsCount)
    const [firstItemIndexOnPage, setFirstItemIndexOnPage] = useState((_currentPage - 1) * _pageSize)
    const [lastItemIndexOnPage, setLastItemIndexOnPage] = useState((_currentPage * _pageSize) - 1)
    const numberOfPages = () => { return Math.ceil(itemCount / _pageSize) }
    const hasNext = () => currentPage + 1 <= numberOfPages()
    const hasPrev = () => currentPage - 1 > 0
    const goNext = () => hasNext() ? setCurrentPage(currentPage + 1) : null
    const goPrev = () => hasPrev() ? setCurrentPage(currentPage - 1) : null

    useEffect(() => {
        setFirstItemIndexOnPage((currentPage - 1) * _pageSize)
        setLastItemIndexOnPage((currentPage * _pageSize) - 1)
    }, [currentPage])

    const Component = () => (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.base }}>
            <TouchableOpacity disabled={!hasPrev()} onPress={goPrev}>
                <Ionicons size={36} color={hasPrev() ? 'white' : colors["base-bg"]} style={{ width: '100%' }} name='arrow-back' />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', paddingHorizontal: 6, color: 'white' }}>{currentPage}/{numberOfPages()}</Text>
            <TouchableOpacity disabled={!hasNext()} onPress={goNext}>
                <Ionicons size={36} color={hasNext() ? 'white' : colors["base-bg"]} style={{ width: '100%' }} name='arrow-forward' />
            </TouchableOpacity>
        </View> 
    )

    return { currentPage, setCurrentPage, setItemCount, numberOfPages, hasNext, hasPrev, goNext, goPrev, firstItemIndexOnPage, lastItemIndexOnPage, Component }
}