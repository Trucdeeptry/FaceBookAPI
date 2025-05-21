const supabase = require("../router/composables/supabase.js");
const fs = require("fs");
const csv = require("csv-parser");


 const { data: profileData, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            firstname: row.firstname,
            surname: row.surname,
            gender: parseInt(row.Gender),
            birthday: row.birthday.split(" ")[0], // "1958-10-15 00:00:00" → "1958-10-15"
            country: row.Country,
          },
        ])