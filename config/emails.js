/**
 * Proceess
 * 
 * When an instructor creates a solicity, send to [all][directors]
 * When solicity change status, send to [instructor][all][director]
 * When generate a new citation, send to [radication]
 * When citation is send, send to [instructor][appretices][all]
 * When a minute is generate, send to [lawyer]
 */

const emails = {
    admin: 'Notificar cada cambio',
    radication: 'Notificar radicación citación',
    lawyer: 'Notificar radicación acta',
    director: 'Notificar creacion solicitud'
}