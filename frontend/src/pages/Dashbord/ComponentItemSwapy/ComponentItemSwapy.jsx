function ComponentItemSwapy({ item, LineChartGraph, CircleChart, BoxChartValue, totalClients, totalActiveClients, totalSuppliers, totalActiveSuppliers }) {
    switch (item) {
        case "item1":
            return (
                <div className="itemSwapy item1" data-swapy-item="item1">
                    <div className="graphs">
                        <LineChartGraph
                            labels={[
                                "Janeiro",
                                "Fevereiro",
                                "Março",
                                "Abril",
                                "Maio",
                                "Junho",
                                "Julho",
                                "Agosto",
                                "Setembro",
                                "Outubro",
                                "Novembro",
                                "Dezembro",
                            ]}
                            labelData1={"Vendas Registradas"}
                            labelData2={"Vendas Canceladas"}
                            colorData1="#0E1D25"
                            colorData2="#80728A"
                        />
                    </div>
                </div>
            )
        case "item2":
            return (
                <div className="itemSwapy item2" data-swapy-item="item2">
                    <div className="graphs">
                        <CircleChart
                            title={"Clientes"}
                            total={totalClients}
                            totalActive={totalActiveClients}
                            colorTotal={"#80728A"}
                            colorTotalActive={"#0E1D25"}
                        />
                    </div>
                </div>
            )
        case "item3":
            return (
                <div className="itemSwapy item3" data-swapy-item="item3">
                    <div className="graphs">
                        <CircleChart
                            title={"Fornecedores"}
                            total={totalSuppliers}
                            totalActive={totalActiveSuppliers}
                            colorTotal={"#B4D3E4"}
                            colorTotalActive={"#1B3B4B"}
                        />
                    </div>
                </div>
            )
        case "item4":
            return (
                <div className="itemSwapy item4" data-swapy-item="item4">
                    <div className="graphs">
                        <BoxChartValue
                            title={"Valor em caixa"}
                            isCredit={true}
                            value={"15610485"}
                        />{" "}
                    </div>
                </div>
            )
        case "item5":
            return (
                <div className="itemSwapy item5" data-swapy-item="item5">
                    <div className="graphs">
                        <BoxChartValue
                            title={"Valor Gasto"}
                            isCredit={false}
                            value={"7610485"}
                        />
                    </div>
                </div>
            )
        default: 
            return (
                <></>
            )
    }
}

export default ComponentItemSwapy