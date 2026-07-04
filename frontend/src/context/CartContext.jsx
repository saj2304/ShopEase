import { createContext, useContext, useState, useCallback } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
const CartContext = createContext(null)
export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 })
  const { isLoggedIn } = useAuth()
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) return
    try { const res = await cartAPI.get(); setCart(res.data.data) } catch {}
  }, [isLoggedIn])
  const addToCart    = async (pid, qty=1) => { await cartAPI.add(pid, qty); fetchCart() }
  const removeFromCart = async (pid)     => { await cartAPI.remove(pid); fetchCart() }
  const updateQuantity = async (pid,qty) => { await cartAPI.update(pid, qty); fetchCart() }
  const clearCart      = async ()        => { await cartAPI.clear(); setCart({ items:[], total:0, itemCount:0 }) }
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}
export const useCart = () => useContext(CartContext)