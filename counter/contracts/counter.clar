;; Multiplayer conract
(define-map user-access principal uint)

(define-read-only (get-count (user principal))
	(default-to u0 (map-get? user-access user))
)

(define-public (increase)
	(ok (map-set user-access tx-sender (+ u1 (get-count tx-sender))))
)