// === BASE DE DATOS DE TIPOS ===
// Aqui tengo guardados los tipos de movimiento fijos del cajero
const BASE_TIPOS = ["Deposito", "Retiro"]
const BASE_DESCRIPCION = ["Ingresa dinero", "Saca dinero"]

// === CONSTANTES ===
// El saldo siempre empieza en 0. No hay IVA ni descuento aqui
const SALDO_INICIAL = 0

// === VECTORES DONDE GUARDO LOS MOVIMIENTOS ===
// Uso 2 vectores paralelos. La posicion 0 de cada uno es del mismo movimiento
let tipos = [] // Aqui guardo "Deposito" o "Retiro"
let montos = [] // Aqui guardo los montos en dolares, solo enteros

// === REFERENCIAS ===
// Conecto los elementos del HTML con JS para poder usarlos
const selectTipo = document.getElementById('select-tipo')
const txtMonto = document.getElementById('id-monto')
const btnAgregar = document.getElementById('btn-agregar-movimiento')
const btnVaciar = document.getElementById('btn-vaciar-movimientos')
const btnCalcular = document.getElementById('btn-calcular-movimientos')
const btnPresentar = document.getElementById('btn-presentar-movimientos')
const btnMayor = document.getElementById('btn-mayor')
const btnMenor = document.getElementById('btn-menor')
const btnPromedio = document.getElementById('btn-promedio')
const btnMediana = document.getElementById('btn-mediana')
const btnModa = document.getElementById('btn-moda')
const btnOrdenar = document.getElementById('btn-ordenar-insercion')
const btnRotar = document.getElementById('btn-rotar-derecha')
const tableTbody = document.querySelector('#id-table-movimientos > tbody')
const txtRespuesta = document.getElementById('id-txt-respuesta')

// ALGORITMO 1: CARGAR TIPOS
// Objetivo: Llenar el select de "Tipo" al inicio con Deposito y Retiro
// Como funciona: Recorro con un for el vector BASE_TIPOS. En cada vuelta creo una opcion <option>
// y al final la pinto en el HTML del select
window.addEventListener('load', function(){
    fnCargarTipos()
})
function fnCargarTipos(){
    let strSelect = ""
    for(let i = 0; i < BASE_TIPOS.length; i++){
        strSelect = strSelect + "<option value='" + i + "'>" + BASE_TIPOS[i] + "</option>"
    }
    selectTipo.innerHTML = strSelect
}

// === EVENTOS DE LOS BOTONES ===
btnAgregar.addEventListener('click', function () { fnAgregarMovimiento() })
btnVaciar.addEventListener('click', function () { fnVaciarMovimientos() })
btnCalcular.addEventListener('click', function () { fnCalcularMovimientos() })
btnPresentar.addEventListener('click', function () { fnPresentarMovimientos() })
btnMayor.addEventListener('click', function () { fnMostrarMayor() })
btnMenor.addEventListener('click', function () { fnMostrarMenor() })
btnPromedio.addEventListener('click', function () { fnMostrarPromedio() })
btnMediana.addEventListener('click', function () { fnMostrarMediana() })
btnModa.addEventListener('click', function () { fnMostrarModa() })
btnOrdenar.addEventListener('click', function () { fnOrdenarInsercion() })
btnRotar.addEventListener('click', function () { fnRotarDerecha() })

// ALGORITMO 2: AGREGAR MOVIMIENTO
// Objetivo: Guardar el movimiento que el usuario elige en los vectores
// Como funciona: 1. Saco el indice del select. 2. Con ese indice busco el tipo en la base
// 3. Valido que el monto sea >= 1 porque no hay centavos. 4. Guardo tipo y monto al final de cada vector
function fnAgregarMovimiento() {
    let indice = parseInt(selectTipo.value)
    let monto = parseInt(txtMonto.value) // Uso parseInt porque no hay decimales
    let tipo = BASE_TIPOS[indice]

    if (monto < 1) { // Validacion para que no metan 0 o negativos
        txtRespuesta.value = "ALERTA: Ingrese un monto valido"
        return
    }
    tipos[tipos.length] = tipo // Agrego al final del vector
    montos[montos.length] = monto
    txtMonto.value = "1" // Reseteo para la proxima
    fnMostrarTabla() // Llamo para que se actualice la tabla
    txtRespuesta.value = "Movimiento agregado: " + tipo + " $" + monto
}

// ALGORITMO 3: MOSTRAR TABLA DE MOVIMIENTOS
// Objetivo: Pintar en el HTML todos los movimientos y calcular el saldo parcial
// Como funciona: Recorro los 2 vectores con un for. Si es Deposito sumo, si es Retiro resto.
// Pero si el retiro es mayor al saldo actual no resto y pongo "Fondos Insuficientes"
function fnMostrarTabla() {
    let str = ""
    let saldoParcial = SALDO_INICIAL
    for (let i = 0; i < tipos.length; i++) {
        let estado = ""
        if(tipos[i] === "Deposito"){
            saldoParcial = saldoParcial + montos[i] // Sumo al saldo
            estado = "OK"
        }else{ // Es Retiro
            if(montos[i] <= saldoParcial){ // SI HAY FONDOS
                saldoParcial = saldoParcial - montos[i] // Resto del saldo
                estado = "OK"
            }else{ // NO HAY FONDOS
                estado = "Fondos Insuficientes" // NO RESTAR
            }
        }
        str = str + "<tr><td>" + tipos[i] + "</td><td>$" + montos[i] + "</td><td>$" + saldoParcial + "</td><td>" + estado + "</td></tr>"
    }
    tableTbody.innerHTML = str // Pinto la tabla
}

// ALGORITMO 4: VACIAR MOVIMIENTOS
// Objetivo: Borrar todo y dejar el cajero en 0
// Como funciona: Vuelvo los 2 vectores a estar vacios [] y limpio la tabla y el resultado
function fnVaciarMovimientos() {
    tipos = []
    montos = []
    tableTbody.innerHTML = ""
    txtRespuesta.value = ""
}

// ALGORITMO 5: CALCULAR TOTAL DEPOSITADO
// Objetivo: Sumar todos los montos que sean de tipo "Deposito"
// Como funciona: Recorro los vectores y solo acumulo si el tipo es igual a "Deposito"
function fnCalcularTotalDepositado() {
    let total = 0
    for (let i = 0; i < tipos.length; i++) {
        if(tipos[i] === "Deposito"){
            total = total + montos[i] // Acumulo solo depositos
        }
    }
    return total
}

// ALGORITMO 6: CALCULAR TOTAL RETIRADO
// Objetivo: Sumar todos los retiros que si se pudieron hacer
// Como funciona: Voy simulando el saldo. Solo sumo el retiro si hay saldo suficiente
function fnCalcularTotalRetirado() {
    let total = 0
    let saldo = SALDO_INICIAL
    for (let i = 0; i < tipos.length; i++) {
        if(tipos[i] === "Deposito"){
            saldo = saldo + montos[i]
        }else{
            if(montos[i] <= saldo){ // Solo sumar si se pudo hacer el retiro
                total = total + montos[i]
                saldo = saldo - montos[i]
            }
        }
    }
    return total
}

// ALGORITMO 7: CALCULAR SALDO FINAL
// Objetivo: Sacar el saldo que queda al final de todos los movimientos
// Como funciona: Recorro todo simulando. Sumo depositos y resto retiros validos
function fnCalcularSaldo() {
    let saldo = SALDO_INICIAL
    for (let i = 0; i < tipos.length; i++) {
        if(tipos[i] === "Deposito"){
            saldo = saldo + montos[i]
        }else{
            if(montos[i] <= saldo){ // Solo restar si se pudo hacer
                saldo = saldo - montos[i]
            }
        }
    }
    return saldo
}

// ALGORITMO 8: CALCULAR MOVIMIENTOS
// Objetivo: Mostrar en el textarea el resumen de total depositado, retirado y saldo final
// Como funciona: Llamo a las 3 funciones de arriba y armo el mensaje de salida
function fnCalcularMovimientos() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    let totalDep = fnCalcularTotalDepositado()
    let totalRet = fnCalcularTotalRetirado()
    let saldo = fnCalcularSaldo()
    txtRespuesta.value = "Total depositado: $" + totalDep.toFixed(2) + "\n" + "Total retirado: $" + totalRet.toFixed(2) + "\n" + "Saldo final: $" + saldo.toFixed(2)
}

// ALGORITMO 9: PRESENTAR MOVIMIENTOS
// Objetivo: Mostrar el contenido de los 2 vectores en formato [dato, dato] y los totales
// Como funciona: Recorro los vectores y armo 2 strings. Luego llamo a las funciones de calculo
function fnPresentarMovimientos() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    let totalDep = fnCalcularTotalDepositado()
    let totalRet = fnCalcularTotalRetirado()
    let saldo = fnCalcularSaldo()

    let strTipos = "["
    let strMontos = "["
    for (let i = 0; i < tipos.length; i++) {
        strTipos = strTipos + '"' + tipos[i] + '"'
        strMontos = strMontos + montos[i].toFixed(2)
        if (i < tipos.length - 1) { strTipos = strTipos + ", "; strMontos = strMontos + ", " }
    }
    strTipos = strTipos + "]"; strMontos = strMontos + "]"

    txtRespuesta.value = "Tipos: " + strTipos + "\n" + "Montos: " + strMontos + "\n" + "----------------------------" + "\n" + "Total depositado: $" + totalDep.toFixed(2) + "\n" + "Total retirado: $" + totalRet.toFixed(2) + "\n" + "Saldo final: $" + saldo.toFixed(2)
}

// === ALGORITMOS DE ESTADISTICAS === SEPARADOS COMO PIDIO EL INGENIERO

// ALGORITMO 10: BUSCAR EL MAYOR
// Objetivo: Encontrar el monto mas alto de todos los movimientos
// Como funciona: Guardo el primer monto como mayor. Luego recorro todo el vector.
// Si encuentro uno mas grande, ese pasa a ser el mayor
function fnBuscarNumeroMayor() {
    let mayor = montos[0]
    for (let i = 0; i < montos.length; i++) { if (montos[i] > mayor) { mayor = montos[i] } }
    return mayor
}

// ALGORITMO 11: BUSCAR EL MENOR
// Objetivo: Encontrar el monto mas bajo de todos los movimientos
// Como funciona: Igual que el mayor pero al reves. Si encuentro uno mas pequeño, ese es el menor
function fnBuscarNumeroMenor() {
    let menor = montos[0]
    for (let i = 0; i < montos.length; i++) { if (montos[i] < menor) { menor = montos[i] } }
    return menor
}

// ALGORITMO 12: CALCULAR PROMEDIO
// Objetivo: Sacar el promedio de todos los montos
// Formula: Promedio = Suma de todos los montos / Cantidad de montos
function fnCalcularPromedio() {
    let suma = 0
    for (let i = 0; i < montos.length; i++) { suma = suma + montos[i] } // Primero sumo todo
    return suma / montos.length // Luego divido
}

// ALGORITMO 13: CALCULAR MEDIANA
// Objetivo: Encontrar el valor del medio de los montos
// Pasos: 1. Copio el vector para no dañarlo. 2. Ordeno la copia con metodo burbuja
// 3. Si la cantidad es par, promedio los 2 del medio. Si es impar, cojo el del medio
function fnCalcularMediana() {
    let vectorOrdenado = []
    for (let i = 0; i < montos.length; i++) { vectorOrdenado[i] = montos[i] } // Paso 1: Copiar
    for (let i = 0; i < vectorOrdenado.length; i++) { // Paso 2: Ordenar con burbuja
        for (let j = 0; j < vectorOrdenado.length - 1; j++) {
            if (vectorOrdenado[j] > vectorOrdenado[j + 1]) {
                let temp = vectorOrdenado[j]
                vectorOrdenado[j] = vectorOrdenado[j + 1]
                vectorOrdenado[j + 1] = temp
            }
        }
    }
    let dimension = vectorOrdenado.length // Paso 3: Sacar el del medio
    if (dimension % 2 == 0) { // Si es par
        let indexCentral = dimension / 2
        let indexAnterior = indexCentral - 1
        return (vectorOrdenado[indexCentral] + vectorOrdenado[indexAnterior]) / 2
    } else { // Si es impar
        let indexCentral = (dimension - 1) / 2
        return vectorOrdenado[indexCentral]
    }
}

// ALGORITMO 14: CALCULAR MODA
// Objetivo: Encontrar el monto que mas se repite
// Como funciona: Uso 2 for anidados. El de afuera agarra 1 monto y el de adentro cuenta cuantas veces se repite
// Guardo el que tenga mayor contador. Si todos se repiten 1 vez, no hay moda
function fnCalcularModa() {
    let maximaRepeticion = 0
    let moda = montos[0]
    for (let i = 0; i < montos.length; i++) {
        let numero = montos[i]
        let contadorRepetido = 0
        for (let j = 0; j < montos.length; j++) { if (numero == montos[j]) { contadorRepetido = contadorRepetido + 1 } } // Cuento repeticiones
        if (contadorRepetido > maximaRepeticion) { maximaRepeticion = contadorRepetido; moda = numero } // Guardo el ganador
    }
    if (maximaRepeticion == 1) { return "No hay moda" } else { return "$" + moda.toFixed(2) }
}

// Estas 5 SON FUNCIONES INDEPENDIENTES. Cada boton llama a 1
// ALGORITMO 15: MOSTRAR MAYOR
function fnMostrarMayor() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    txtRespuesta.value = "El monto Mayor es: $" + fnBuscarNumeroMayor().toFixed(2)
}

// ALGORITMO 16: MOSTRAR MENOR
function fnMostrarMenor() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    txtRespuesta.value = "El monto Menor es: $" + fnBuscarNumeroMenor().toFixed(2)
}

// ALGORITMO 17: MOSTRAR PROMEDIO
function fnMostrarPromedio() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    txtRespuesta.value = "El Promedio es: $" + fnCalcularPromedio().toFixed(2)
}

// ALGORITMO 18: MOSTRAR MEDIANA
function fnMostrarMediana() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    txtRespuesta.value = "La Mediana es: $" + fnCalcularMediana().toFixed(2)
}

// ALGORITMO 19: MOSTRAR MODA
function fnMostrarModa() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos"; return }
    txtRespuesta.value = "La Moda es: " + fnCalcularModa()
}

// ALGORITMO 20: ORDENAR POR INSERCION
// Objetivo: Ordenar los movimientos de menor a mayor monto
// Como funciona: Voy cogiendo 1 elemento a la vez. Lo comparo con los de la izquierda.
// Mientras sea menor, los voy corriendo 1 puesto a la derecha. Al final pinto la tabla.
// Nota: No calculo saldo aqui porque al ordenar se pierde la secuencia real
function fnOrdenarInsercion() {
    if (tipos.length == 0) { txtRespuesta.value = "ALERTA: No hay movimientos para ordenar"; return }
    let tipoTemp = []
    let montoTemp = []
    for (let i = 0; i < tipos.length; i++) { // Copio todo a temporales para no perder datos
        tipoTemp[i] = tipos[i]
        montoTemp[i] = montos[i]
    }
    // Algoritmo de insercion
    for (let i = 1; i < montoTemp.length; i++) {
        let montoActual = montoTemp[i]
        let tipoActual = tipoTemp[i]
        let j = i - 1
        while (j >= 0 && montoTemp[j] > montoActual) { // Mientras el de la izquierda sea mayor, corro
            montoTemp[j + 1] = montoTemp[j]
            tipoTemp[j + 1] = tipoTemp[j]
            j = j - 1
        }
        montoTemp[j + 1] = montoActual // Inserto en su lugar
        tipoTemp[j + 1] = tipoActual
    }

    let str = "" // Pinto la tabla ordenada en amarillo y sin saldo
    for (let i = 0; i < tipoTemp.length; i++) {
        str = str + "<tr><td>" + tipoTemp[i] + "</td><td>$" + montoTemp[i] + "</td><td>-</td><td bgcolor='#FFFF00'>Ordenado</td></tr>"
    }
    tableTbody.innerHTML = str
    txtRespuesta.value = "Movimientos ordenados por monto. Para ver saldo use Calcular Movimientos"
}