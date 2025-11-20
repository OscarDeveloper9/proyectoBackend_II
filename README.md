# Proyecto Backend II - Entrega Mejorada (Mongoose) - Español

¡Hola! Este proyecto es una versión profesionalizada del backend, con arquitectura por capas, patrones Repository/DAO, DTOs, recuperación de contraseña por email, roles y autorizaciones, y una lógica de compra robusta con tickets.

## Qué incluye (resumen rápido)

- Repositorios (Repository pattern) + DAOs separados de la lógica de negocio.
- DTO para la ruta `/api/auth/current` (no se expone password ni datos sensibles).
- Recuperación de contraseña: email con botón, enlace expira en 1 hora, no permite poner la misma contraseña vieja.
- Middlewares de autorización por rol (`requireRole`).
- Modelo `Ticket` y lógica de compra que verifica stock y genera tickets (complete / incomplete).
- `.env.example` y README con instrucciones.

## Cómo usar

1. Clona o descomprime el zip.
2. `npm install`
3. Copia `.env.example` a `.env` y completa tus credenciales (Mongo y SMTP).
4. `npm run dev`

## Rutas principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/current` (requiere Bearer token)
- `POST /api/auth/forgot` (body: { email })
- `POST /api/auth/reset` (body: { userId, token, newPassword })

- `GET /api/products`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

- `POST /api/purchase` (user; body: { cart: [{productId, quantity}] })
