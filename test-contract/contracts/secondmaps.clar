(define-map namesmap { name: (string-ascii 24)} { id: int})

(define-public (insert-item (name (string-ascii 24)) (id int))
	(begin
		(if (> (len name) u24) (err 1) (begin
		(asserts! (is-eq id id) (err 1))
		(map-set namesmap (tuple (name name)) (tuple (id id)))
		(ok true)

		))
	)
)


(define-public (get-item (name (string-ascii 24)))
	(begin
		(if (> (len name) u24) (err 1)
		(begin
			(let ((res (default-to -1 (get id (map-get? namesmap {name: name})))))
				(ok res)
			)
		))
	)
)