/** Cart line shape persisted in React Context + localStorage (blueprint §3). */
export type CartItem = {
  productId: number
  variationId: number
  quantity: number
  price: number
}

export type CartState = {
  items: CartItem[]
}
