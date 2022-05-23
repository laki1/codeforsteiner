import type { RequestHandler } from '@sveltejs/kit';
import db from '~/db';
import { DB } from '~/config.js';

//TODO: any order?

export const get: RequestHandler = async ({ url: { searchParams } }) => {
  let count = 0, errorMessage = "ok", searchedText = null, offset = 0, limit = 20,
      response, query;

  if (searchParams.has("limit")) {
    limit = parseInt(searchParams.get("limit")) || 20
  }
  if (searchParams.has("offset")) {
    offset = parseInt(searchParams.get("offset")) || 0
  }
  searchedText = searchParams.get("searchedText");  

  try {
    query = db(DB.TABLE_DGA).where(
        db.raw("(PLATIOD <= CURRENT_TIMESTAMP AND PLATIDO >= CURRENT_TIMESTAMP)")   //firebird && mariadb have CURRENT_TIMESTAMP variable
    );

    if (searchedText !== null) {
      query = query.andWhere(function() {
        (DB.TYPE !== "mariadb")
          ? this.whereLike("KOD", `'${searchedText}%'`).orWhereLike("NAZ", `'${searchedText}%'`)  ////spravne reseni, ale MariaDB ma potize s doplnenymi COLLATE
          : this.where(db.raw(`KOD LIKE '${searchedText}%'`)).orWhere(db.raw(`NAZ LIKE '${searchedText}%'`))
      });
    }

    response = await query.clone().count("KOD as CNT");  //KOD is primary uniq key - there is no need to use distict and/or having
    count = response?.[0]?.["CNT"] || 0;
    count = parseInt(count) || 0;   //MariaDB returns via builder value "XXXn" :-(

    response = await query.clone().select("KOD", "NAZ").offset(offset).limit(limit);
  } catch (e) {
    errorMessage = e.toString();
  } 

  return {
    body: {
      count: count,
      data:  response,
      error: errorMessage
    }
  }
}
