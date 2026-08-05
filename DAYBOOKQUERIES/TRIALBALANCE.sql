	DECLARE @OrganizationID		VARCHAR(24)	= 'COMP123456789'
			,@DivisionID		VARCHAR(24)	= 'D001'
			,@SDATE				VARCHAR(24) = '1 APR 2024'
			,@EDATE				VARCHAR(24)	= '28 JUN 2025'
			,@LEVEL				VARCHAR(2)	= '%'
	
	SET NOCOUNT ON;
	
	IF OBJECT_ID('tempdb.dbo.#TBTEMPTBL', 'U') IS NOT NULL 
	DROP TABLE #TBTEMPTBL;

	IF OBJECT_ID('tempdb.dbo.#TBTEMPTBL_M', 'U') IS NOT NULL
	DROP TABLE #TBTEMPTBL_M;

	IF OBJECT_ID('tempdb.dbo.#TBTEMPTBL_G', 'U') IS NOT NULL
	DROP TABLE #TBTEMPTBL_G;

	IF OBJECT_ID('tempdb.dbo.#TB', 'U') IS NOT NULL
	DROP TABLE #TB;

	IF OBJECT_ID('tempdb.dbo.#VOUCHER_TB', 'U') IS NOT NULL
	DROP TABLE #VOUCHER_TB;

	IF OBJECT_ID('tempdb.dbo.#ACC_TB', 'U') IS NOT NULL
	DROP TABLE #ACC_TB;


	SELECT		*
	INTO		#VOUCHER_TB
	FROM		ST_Voucher
	WHERE		IsDeleted					= 0
		AND		OrganizationID				= @OrganizationID
		AND		'|' + @DivisionID + '|'			LIKE	CASE @DivisionID
														WHEN '' THEN '%'
														ELSE '%|' + DivisionID + '|%' 
													END

	SELECT		*
	INTO		#ACC_TB
	FROM		tblACCOUNTS B
	WHERE		B.IsDeleted		= 0


SELECT				MGRPID,
					SGRPID,
					GLRPID,
					ACCAID,
					ClosingAmount,
					DRCRStatus

INTO				#TBTEMPTBL

	FROM		(
						SELECT		ABS(ROUND(SUM(VoucherAmount),2))		AS ClosingAmount,
									'DR'						AS DRCRStatus,
									A.MGRPID	
									,A.SGRPID	
									,A.GLRPID
									,A.ACCAID
						FROM		#VOUCHER_TB VOU
							LEFT JOIN	tblACCOUNTS	 A ON A.ISDELETED = 0 AND  A.ACCAID = VOU.DRACC
						WHERE		VOU.IsDeleted					= 0
							AND		VOU.OrganizationID				= @OrganizationID
							AND		'|' + @DivisionID + '|'			LIKE	CASE @DivisionID
																			WHEN '' THEN '%'
																			ELSE '%|' + VOU.DivisionID + '|%' 
																	END
							--AND		VOU.VoucherAID					= CB.VAID
							AND		VOU.VoucherTID					<> 'PD'
							AND		CAST(VOU.VoucherDate AS DATE)	BETWEEN @SDATE AND @EDATE
							AND		VOU.DRACC						<> 'PKACC00000000000'
							AND		VOU.DRACC						<> 'PK0034'
							AND     VOU.VoucherAmount				> 0

					GROUP BY			ACCAID, 
										GLRPID,
										MGRPID,
										SGRPID

					UNION 

					SELECT		ABS(ROUND(SUM(VoucherAmount),2))		AS ClosingAmount,
									'CR'						AS DRCRStatus,
									A.MGRPID	
									,A.SGRPID	
									,A.GLRPID
									,A.ACCAID
						FROM		#VOUCHER_TB VOU
							LEFT JOIN	tblACCOUNTS	 A ON A.ISDELETED = 0 AND  A.ACCAID = VOU.DRACC
						WHERE		VOU.IsDeleted					= 0
							AND		VOU.OrganizationID				= @OrganizationID
							AND		'|' + @DivisionID + '|'			LIKE	CASE @DivisionID
																			WHEN '' THEN '%'
																			ELSE '%|' + VOU.DivisionID + '|%' 
																	END
							--AND		VOU.VoucherAID					= CB.VAID
							AND		VOU.VoucherTID					<> 'PD'
							AND		CAST(VOU.VoucherDate AS DATE)	BETWEEN @SDATE AND @EDATE
							AND		VOU.DRACC						<> 'PKACC00000000000'
							AND		VOU.CRACC						<> 'PK0034'
							AND     VOU.VoucherAmount				< 0

					GROUP BY			ACCAID, 
										GLRPID,
										MGRPID,
										SGRPID
			)A

	SELECT				MGRPID,
						''						AS GRPID,
						''						AS ACCAID,
						SUM(ClosingAmount)		AS ClosingAmount,
						DRCRStatus
	INTO				#TBTEMPTBL_M
	FROM				#TBTEMPTBL
	GROUP BY			DRCRStatus,
						MGRPID


	SELECT				MGRPID,
						GLRPID,
						''						AS ACCAID,
						SUM(ClosingAmount)		AS ClosingAmount,
						DRCRStatus
	INTO				#TBTEMPTBL_G
	FROM				#TBTEMPTBL
	GROUP BY			DRCRStatus,
						GLRPID,
						MGRPID


SELECT				*
	INTO				#TB
	FROM
	(
	SELECT				CB.MGRPID										AS MGRPID,
							CAST('' AS NVARCHAR(256))						AS MGroupAccName,
							CAST('' AS NVARCHAR(256))						AS MGroupAccNameE,
							CB.GLRPID										AS GRPID,
							ACCG.ACCTM										AS GroupAccName,
							ACCG.ACCTE										AS GroupAccNameE,
							''												AS ACCAID,
							''												AS AccName,
							''												AS AccNameE,
							CB.ClosingAmount								AS TotalAmount,
							CB.DRCRStatus									AS CBStatus,
							'2'												AS AccLevel

		FROM				#TBTEMPTBL_G CB

			CROSS APPLY		(
								SELECT			*
								FROM			#ACC_TB
								WHERE			IsDeleted		= 0
									AND			ACCAID			= CB.GLRPID
							) ACCG
		UNION


		SELECT				CB.MGRPID				AS MGRPID,
							''						AS MGroupAccName,
							''						AS MGroupAccNameE,
							CB.GLRPID				AS GRPID,
							''						AS GroupAccName,
							''						AS GroupAccNameE,
							CB.ACCAID				AS ACCAID,
							ACC.ACCTM				AS AccName,
							ACC.ACCTE				AS AccNameE,
							CB.ClosingAmount		AS TotalAmount,
							CB.DRCRStatus			AS CBStatus,
							'3'						AS AccLevel

		FROM				#TBTEMPTBL CB

			CROSS APPLY		(
								SELECT			*
								FROM			#ACC_TB
								WHERE			IsDeleted		= 0
									AND			ACCAID			= CB.ACCAID
							) ACC
	) AS T


	DECLARE	@CB FLOAT

	SET		@CB = ( SELECT COALESCE(AVG(ClosingBalance), 0) AS ClosingBalance FROM GET_DailyClosingBalance(@OrganizationID, @DivisionID, @EDATE)) 

	INSERT INTO	#TB	(
							MGRPID,
							MGroupAccName,
							MGroupAccNameE,
							GRPID,
							GroupAccName,
							GroupAccNameE,
							ACCAID,
							AccName,
							AccNameE,
							TotalAmount,
							CBStatus,
							AccLevel
						)
	VALUES				(
							'AAAAAAAAAA',
							N'अखेरची रोख शिल्लक',
							N'Last Cash In Hand',
							'AAAAAAAAAA',
							N'अखेरची रोख शिल्लक',
							N'Last Cash In Hand',
							'AAAAAAAAAA',
							N'',
							N'',
							@CB,
							'CR',
							'2'
						)	
						
	SET		@CB = ( SELECT COALESCE(AVG(ClosingBalance), 0) AS ClosingBalance FROM GET_DailyClosingBalance(@OrganizationID, @DivisionID, DATEADD(DD, -1, CAST(@SDATE AS DATETIME)))) 						
			
	INSERT INTO	#TB	(
							MGRPID,
							MGroupAccName,
							MGroupAccNameE,
							GRPID,
							GroupAccName,
							GroupAccNameE,
							ACCAID,
							AccName,
							AccNameE,
							TotalAmount,
							CBStatus,
							AccLevel
						)
	VALUES				(
							--'PKACC00000000230',
							' AAAAAAAAAA',
							N'आरंभीची रोख शिल्लक',
							N'Last Cash In Hand',
							'AAAAAAAAAA',
							N'आरंभीची रोख शिल्लक',
							N'Last Cash In Hand',
							'AAAAAAAAAA',
							N'',
							N'',
							@CB,
							'DR',
							'2'
						)			
	
	SELECT				#TB.*
						,CASE
							WHEN ACCAID = 'AAAAAAAAAA' THEN 232
							ELSE COALESCE(ACC.ACCGID, GRPID.ACCGID)	
						END													AS ACCGID
		
	FROM				#TB
		OUTER APPLY	(
			SELECT		ACCGID
			FROM		tblACCOUNTS
			WHERE		IsDeleted	= 0
				AND		ACCAID		= #TB.ACCAID
		) ACC

		OUTER APPLY	(
			SELECT		ACCGID
			FROM		tblACCOUNTS
			WHERE		IsDeleted	= 0
				AND		ACCAID		= #TB.GRPID
		) GRPID

	ORDER BY			CBStatus,
						MGRPID, 
						GRPID,
						AccLevel

--SELECT * FROM #TB
--SELECT * FROM #TBTEMPTBL
--SELECT * FROM #TBTEMPTBL_M
--SELECT * FROM #TBTEMPTBL_G

















--SELECT	MGRPID,
--		GRPID,
--		ACCAID,
--		ClosingAmount,
--		DRCRStatus

--INTO				#TBTEMPTBL

--FROM				(
--		SELECT				MGRPID,
--							GRPID,
--							ACCAID,							
--							ABS(ROUND(SUM(AMT),2))		AS ClosingAmount,
--							'DR'						AS DRCRStatus
--		FROM				#CB_TB CB

--			CROSS APPLY		(
--								SELECT		VAID
--								FROM		#VOUCHER_TB VOU
--								WHERE		VOU.IsDeleted					= 0
--									AND		VOU.OrganizationID				= @PAXID
--									--AND		VOU.DivisionID		LIKE	CASE @DEPTID
--									--										WHEN '' THEN '%'
--									--										ELSE @DEPTID
--									--									END
--									AND		'|' + @DEPTID + '|'		LIKE	CASE @DEPTID
--																				WHEN '' THEN '%'
--																				ELSE '%|' + VOU.DivisionID + '|%' 
--																			END
--									AND		VOU.VoucherAID			= CB.VAID
--									AND		VOU.VoucherTID			<> 'PD'
--							) VOU

	
--		WHERE				CB.IsDeleted						= 0
--			AND				CB.PAXID							= @PAXID
--			--AND				CB.DEPTID				LIKE	CASE @DEPTID
--			--													WHEN '' THEN '%'
--			--													ELSE @DEPTID
--			--												END

--			--AND				'|' + @DEPTID + '|'				LIKE	CASE @DEPTID
--			--															WHEN '' THEN '%'
--			--															ELSE '%|' + CB.DEPTID + '|%'
--			--														END
--			AND				CB.DATEID						BETWEEN @SDATE AND @EDATE
--			AND				CB.ACCAID						<> 'PKACC00000000000'
--			AND				CB.MGRPID						<> 'PKACC00000000230'
--			AND				CB.AMT							> 0

--		GROUP BY			ACCAID, 
--							GRPID,
--							MGRPID	

--		UNION

--		SELECT				MGRPID,
--							GRPID,
--							ACCAID,							
--							ABS(ROUND(SUM(AMT),2))		AS ClosingAmount,
--							'CR'						AS DRCRStatus
--		FROM				#CB_TB CB

--			CROSS APPLY		(
--								SELECT		VAID
--								FROM		#VOUCHER_TB VOU
--								WHERE		VOU.IsDeleted		= 0
--									AND		VOU.OrganizationID	= @PAXID
--									--AND		VOU.DivisionID		LIKE	CASE @DEPTID
--									--										WHEN '' THEN '%'
--									--										ELSE @DEPTID
--									--									END

--									AND		'|' + @DEPTID + '|'	LIKE	CASE @DEPTID
--																			WHEN '' THEN '%'
--																			ELSE '%|' + VOU.DivisionID + '|%'
--																		END

--									AND		VOU.VoucherAID		= CB.VAID
--									AND		VOU.VoucherTID		<> 'PD'
--							) VOU
	
--		WHERE				CB.IsDeleted			= 0
--			AND				CB.PAXID				= @PAXID
--			--AND				CB.DEPTID				LIKE	CASE @DEPTID
--			--													WHEN '' THEN '%'
--			--													ELSE @DEPTID
--			--												END

--			AND				'|' + @DEPTID	+ '|'	LIKE	CASE @DEPTID
--																WHEN '' THEN '%'
--																ELSE '%|' + CB.DEPTID + '|%'
--															END
--			AND				CB.DATEID				BETWEEN @SDATE AND @EDATE
--			AND				CB.ACCAID				<> 'PKACC00000000000'
--			AND				CB.MGRPID				<> 'PKACC00000000230'
--			AND				CB.AMT					< 0

--		GROUP BY			ACCAID, 
--							GRPID,
--							MGRPID
--	) A