# Mowi Store — Backend

Placeholder. Por implementar en próxima sesión.

## Stack previsto

- Django 5.x
- Django REST Framework
- scikit-learn (recomendador)
- Supabase Postgres (connection via psycopg)
- Autenticación: JWT (`djangorestframework-simplejwt`) o Supabase Auth pass-through

## Módulos previstos

| App | Responsabilidad |
|---|---|
| `accounts` | Usuarios (clientes, proveedores, admin) |
| `catalog` | Productos, categorías, marcas, stock por proveedor |
| `suppliers` | Proveedores (Wilson, Mesa Redonda, Arenales) |
| `orders` | Carrito, checkout, pedidos, comisión 6% |
| `payments` | Validación manual/automática de transferencia bancaria |
| `reviews` | Reseñas verificadas (solo compradores) |
| `recommendations` | Endpoint scikit-learn (content-based + collaborative filtering) |
| `logistics` | Asignación Olva/InDrive según producto y zona |
| `admin_panel` | Endpoints para dashboard administrativo |

## Recomendador IA (scikit-learn)

Plan inicial:
1. **Content-based** (TF-IDF + cosine similarity sobre `nombre + categoría + tags`)
2. **Collaborative filtering** (matrix factorization con usuarios que ya compraron)
3. **Híbrido**: ponderar ambos según historial del usuario
4. Endpoint: `GET /api/recommendations/?user_id=...&product_id=...&k=10`

## Pendiente cuando arranquemos backend

- Definir esquema Postgres (tablas: users, products, suppliers, orders, payments, reviews, recommendations)
- ~~Supabase~~ removido del proyecto (decisión 2026-06-22, curso es de Marketing/Innovación → compra simulada en frontend)
- Cuando arranque backend, usar Postgres local o Heroku/Railway/Render directo (sin pasar por Supabase)
