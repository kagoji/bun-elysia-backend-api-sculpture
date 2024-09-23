class QuizRepo {

    // Check if a participant is already subscribed
    static quizParticipateCheck(msisdn: string): string {
        const sql: string = `SELECT * FROM quiz_subscription WHERE msisdn LIKE '${msisdn}' LIMIT 1`;
        return sql;
    }

    // Insert new participant data into the quiz_subscription table
    static participateDataInsert(
        formatted_msisdn: string,
        participate_name: string,
        operator: string,
        participate_email: string,
        gender: string,
        birth_date: string
    ): string {
        const sql: string = `INSERT INTO quiz_subscription (msisdn,paritcipate_name,operator,paritcipate_email,gender,age_group)
                             VALUES('${formatted_msisdn}','${participate_name}','${operator}','${participate_email}','${gender}','${birth_date}')`;
        console.log(sql);
        return sql;
    }
}

export default QuizRepo;
