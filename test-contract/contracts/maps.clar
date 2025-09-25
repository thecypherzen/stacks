(define-map names (string-ascii 64) principal)

(define-public (insert-name (key (string-ascii 64)) (value principal) (replace bool))
	(begin
		(asserts! (> (len key) u0) (err 1))
		(asserts! (is-eq value value) (err 1))
		(if replace (map-set names key value) (map-insert names key value))
		(ok true)
	)
)

(define-public (get-name (key (string-ascii 64)))
	(begin
		(let ((item (unwrap! (map-get? names key) (err -1))))
			(ok item)
		)
	)
)

(define-public (print-names)
	(begin
		(print "me")
		(ok true)
	)
)