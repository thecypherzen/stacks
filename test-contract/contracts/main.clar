(define-data-var myvar uint u10)


(define-public (read-var)
	(ok (var-get myvar))
)

(define-public (update-var (newvar uint))
	(if (< newvar u0)
		(err u1)
		(begin
			(var-set myvar newvar)
			(ok (var-get myvar))
		)
	)
)

(define-public (reset-var)
	(begin
		(var-set myvar u0)
		(ok (var-get myvar))
	)
)
