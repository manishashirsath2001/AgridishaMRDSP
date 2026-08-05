--SELECT * FROM tblACCOUNTS WHERE RPTID = '1'

--SELECT * FROM ST_Voucher WHERE CAST(VoucherDate  AS DATE) <= CAST('1 JUL 2025' AS DATE) AND IsDeleted = 0
DECLARE @OrganizationID VARCHAR(24)	 = 'COMP123456789' 
		,@DivisionID VARCHAR(24)	 = 'D001'
		,@DATE  VARCHAR(50)		 = '1 JUL 2025'

;WITH VoucherView AS(
		SELECT		ABS(V.VoucherAmount)			AS VoucherAmount,
					V.DRACC,
					V.CRACC,
					DivisionID
		FROM		ST_Voucher V
		WHERE		V.IsDeleted					= 0
			AND		V.OrganizationID			= @OrganizationID
			AND		',' + @DivisionID + ','			LIKE	CASE @DivisionID
														WHEN '%' THEN '%'
														ELSE '%,' + V.DivisionID + ',%'
													END
			AND CAST(V.VoucherDate  AS DATE)	<= CAST(@DATE AS DATE)
	),

 cteCRDR AS (
	SELECT		V.DRACC											AS ACCAID
				,VoucherAmount
				,DivisionID
									
	FROM		VoucherView V
	WHERE		V.DRACC						<> 'PKACC00000000000'
		AND		DRACC						<> 'PK0034'
	UNION ALL

	SELECT		V.CRACC											AS ACCAID,		
				0 - VoucherAmount								AS VoucherAmount
				,DivisionID
									
	FROM		VoucherView V
	WHERE		V.CRACC						<> 'PKACC00000000000'
		AND		CRACC						<> 'PK0034'

),
cteBSDATA AS (
	SELECT		ROUND(SUM(C.VoucherAmount), 2)				AS AMT
				,COALESCE(C.ACCAID, '')						AS ACCAID
				,COALESCE(C.DivisionID,'')					AS DEPTID
				,COALESCE(A.ACCTM,'')						AS ACCOUNTNAME	
				,A.SGRPID									AS SGRPID
				,S.ACCTM									AS SUBGROUP
				,A.MGRPID									AS MGRPID
				,ACC.ACCTM									AS MAINGROUP
	FROM		cteCRDR C
		INNER JOIN tblACCOUNTS A	ON A.RPTID	 = '1'  AND A.ISDELETED		= 0 AND A.ACCAID	= C.ACCAID
		INNER JOIN tblACCOUNTS S	ON S.RPTID	 = '1'  AND S.ISDELETED		= 0 AND S.ACCAID	= A.SGRPID
		INNER JOIN tblACCOUNTS ACC	ON ACC.RPTID = '1'  AND ACC.ISDELETED	= 0 AND ACC.ACCAID	= A.MGRPID
	WHERE		C.VoucherAmount		<> 0
	GROUP BY	C.ACCAID
				,C.DivisionID
				,A.ACCTM
				,A.SGRPID
				,S.ACCTM
				,A.MGRPID
				,ACC.ACCTM	
	UNION ALL

	SELECT	ClosingBalance			AS AMT
			,'CASH'					AS ACCAID
			,@DivisionID			AS DEPTID
			,N'अखेरची रोख शिल्लक'	AS ACCOUNTNAME
			,'CASH'					AS SGRPID
			,N'अखेरची रोख शिल्लक'	AS SUBGROUP
			,'CASH'					AS MGRPID
			,N'अखेरची रोख शिल्लक'	AS MAINGROUP	
	FROM	GET_DailyClosingBalance(@OrganizationID,@DivisionID,@DATE)
)


SELECT	 COALESCE(AMT		  ,0)	AS AMT
		,COALESCE(ACCAID	  ,'')	AS ACCAID
		,COALESCE(DEPTID	  ,'')	AS DEPTID
		,COALESCE(ACCOUNTNAME ,'') 	AS ACCOUNTNAME
		,COALESCE(SGRPID	  ,'')	AS SGRPID
		,COALESCE(SUBGROUP	  ,'')	AS SUBGROUP
		,COALESCE(MGRPID	  ,'') 	AS MGRPID
		,COALESCE(MAINGROUP	  ,'')	AS MAINGROUP	
FROM	cteBSDATA
