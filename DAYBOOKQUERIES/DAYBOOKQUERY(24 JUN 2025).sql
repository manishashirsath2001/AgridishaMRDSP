;WITH cteVoucher AS (
	SELECT			*	

	FROM			ST_VOUCHER V

	WHERE			IsDeleted			= 0
		AND			OrganizationID		= 'COMP123456789'
		AND			VoucherDate			= CAST('24 JUN 2025 23:59:59' AS DATE)
		AND			(
			('D001' = '%')
			OR
			('D001'  <> '%' AND ',' +  'D001' + ',' LIKE '%,' + DivisionID + ',%')
		)
		AND			VoucherTID			<> 'PD'
)

,cteCashVoucher AS (
	SELECT		*

	FROM		cteVoucher V
	
	WHERE		EXISTS (
		SELECT		GRPKEY
		FROM		cteVoucher
		WHERE		'PK0034'		IN	(DRACC, CRACC)
			AND		GRPKEY			=	V.GRPKEY
	)
)

,cteTransferVoucher AS (
	SELECT		* 
	
	FROM		cteVoucher V

	WHERE		NOT EXISTS (
		SELECT		GRPKEY
		FROM		cteVoucher
		WHERE		'PK0034'		IN	(DRACC, CRACC)
			AND		GRPKEY			=	V.GRPKEY
	)
)

,cteDayBookV AS (
	
	SELECT		VoucherDate												AS TRNDT			
				,SerialNumber
				,DRACC													AS ACCID
				,COALESCE(SUM(COALESCE(VoucherAmount, 0)), 0)			AS Amount
				,ReferenceKey
				,Narration
				,GRPKEY
				,'DR'													AS DRCR			
				,'C'													AS TRNMODE
				,OID

	FROM		cteCashVoucher

	WHERE		'PK0034'						NOT IN (DRACC)
		AND		DRACC						<> 'PKACC00000000000'

	GROUP BY	VoucherDate
				,SerialNumber
				,DRACC
				,ReferenceKey
				,Narration
				,GRPKEY
				,OID
	
	UNION ALL

	SELECT		VoucherDate												AS TRNDT
				,SerialNumber
				,CRACC													AS ACCID
				,COALESCE(SUM(COALESCE(VoucherAmount, 0)), 0)			AS Amount
				,ReferenceKey
				,Narration
				,GRPKEY
				,'CR'													AS DRCR	
				,'C'													AS TRNMODE
				,OID

	FROM		cteCashVoucher

	WHERE		'PK0034'		NOT IN (CRACC)
		AND		CRACC			<> 'PKACC00000000000'

	GROUP BY	VoucherDate
				,SerialNumber
				,CRACC
				,ReferenceKey
				,Narration
				,GRPKEY
				,OID

	UNION ALL


	SELECT		VoucherDate												AS TRNDT
				,SerialNumber
				,DRACC													AS ACCID
				,COALESCE(SUM(COALESCE(VoucherAmount, 0)), 0)			AS Amount
				,ReferenceKey
				,Narration
				,GRPKEY
				,'DR'													AS DRCR			
				,'T'													AS TRNMODE
				,OID

	FROM		cteTransferVoucher

	WHERE		DRACC			<> 'PKACC00000000000'
	
	GROUP BY	VoucherDate
				,SerialNumber
				,DRACC
				,ReferenceKey
				,Narration
				,GRPKEY
				,OID

	UNION	ALL

	SELECT		VoucherDate												AS TRNDT
				,SerialNumber
				,CRACC													AS ACCID
				,COALESCE(SUM(COALESCE(VoucherAmount, 0)), 0)			AS Amount
				,ReferenceKey
				,Narration
				,GRPKEY
				,'CR'													AS DRCR			
				,'T'													AS TRNMODE
				,OID

	FROM		cteTransferVoucher

	WHERE		CRACC			<> 'PKACC00000000000'

	GROUP BY	VoucherDate
				,SerialNumber
				,CRACC
				,ReferenceKey
				,Narration
				,GRPKEY
				,OID

	UNION ALL

	SELECT			CAST('24 JUN 2025 23:59:59' AS DATE)								AS VoucherDate
					,''													AS SerialNumber
					,'PK0034'											AS DRACC
					,
					COALESCE(ROUND(SUM	(
							CASE 
								WHEN  'PK0034' = DRACC  THEN VoucherAmount
								WHEN  'PK0034' = CRACC THEN 0 - VoucherAmount
								ELSE 0
							END
						),2), 0)										AS Amount

					,''													AS ReferenceKey
					,''													AS Narration
					,''													AS GRPKEY
					,'DR'												AS DRCR			
					,'C'												AS TRNMODE
					,''													AS OID

	FROM			ST_Voucher 
	WHERE			IsDeleted				= 0
		AND			OrganizationID			= 'COMP123456789' 
		
		AND		(
			('D001' = '%')
			OR
			('D001'  <> '%' AND ',' +  'D001' + ',' LIKE '%,' + DivisionID + ',%')
		)
		AND			'PK0034'					IN (DRACC, CRACC)
		
		AND			VoucherDate				< CAST('24 JUN 2025 23:59:59' AS DATE)
		AND			VoucherTID				<> 'PD'

	UNION ALL

	SELECT			CAST('24 JUN 2025 23:59:59' AS DATE)								AS VoucherDate
					,''													AS SerialNumber
					,'PK0034'											AS DRACC
					,
					COALESCE(ROUND(SUM	(
							CASE 
								WHEN  'PK0034' = DRACC  THEN VoucherAmount
								WHEN  'PK0034' = CRACC THEN 0 - VoucherAmount
								ELSE 0
							END
						),2), 0)										AS Amount

					,''													AS ReferenceKey
					,''													AS Narration
					,''													AS GRPKEY
					,'CR'												AS DRCR			
					,'C'												AS TRNMODE
					,''													AS OID

	FROM			ST_Voucher 
	WHERE			IsDeleted				= 0
		AND			OrganizationID			= 'COMP123456789' 
		
		AND		(
			('D001' = '%')
			OR
			('D001'  <> '%' AND ',' +  'D001' + ',' LIKE '%,' + DivisionID + ',%')
		)
		AND			'PK0034'					IN (DRACC, CRACC)
		
		AND			VoucherDate				<= CAST('24 JUN 2025 23:59:59' AS DATE)
		AND			VoucherTID				<> 'PD'

)

,cteAccounts AS (
	SELECT		ACCAID	
				,MGRPID
				,GLRPID   AS GRPID
				,ACCTM

	FROM		tblACCOUNTS

	WHERE		IsDeleted	=	0
		AND		LevelID		=	'3'
)

SELECT		DB.*
			,COALESCE(ACC.MGRPID, '')				AS MGRPID
			,COALESCE(ACC.GRPID, '')				AS GRPID
			,COALESCE(ACC.ACCTM, '')				AS MGRPID
FROM		cteDayBookV DB

	LEFT JOIN cteAccounts ACC ON ACC.ACCAID =	DB.ACCID

ORDER BY	TRNDT
			,DRCR
			,COALESCE(ACC.MGRPID, '')
			,COALESCE(ACC.GRPID, '')
			,COALESCE(ACCID, '')
			,SerialNumber
go