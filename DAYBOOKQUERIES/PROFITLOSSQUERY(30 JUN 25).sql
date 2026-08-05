DECLARE @OrganizationID VARCHAR(24)	 = 'COMP123456789' 
		,@DivisionID VARCHAR(24)	 = 'D001'
		,@SDATE  VARCHAR(50)		 = '30 jun 2025'
		,@EDATE	VARCHAR(50)			 = '1 jul 2025'


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
			AND V.VoucherDate				BETWEEN CAST(@SDATE AS DATE) AND CAST(@EDATE AS DATE)
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

)

SELECT		ROUND(SUM(C.VoucherAmount), 2)				AS AMT
			,COALESCE(C.ACCAID, '')						AS ACCAID
			,COALESCE(C.DivisionID,'')					AS DEPTID
			,COALESCE(A.ACCTM,'')						AS ACCOUNTNAME		
FROM		cteCRDR C
	INNER JOIN tblACCOUNTS A ON A.RPTID = '3'  AND A.ISDELETED = 0 AND A.ACCAID = C.ACCAID
WHERE		C.VoucherAmount		<> 0
GROUP BY	C.ACCAID
			,C.DivisionID
			,A.ACCTM


--SELECT * FROM GET_ProfitLossData('COMP123456789' , 'D001', '1 JULY 2025','30 JULY 2025')