const supabase = require("../router/composables/supabase.js");
const fs = require("fs");
const csv = require("csv-parser");


 const { data: profileData, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            firstname: 'test',
            surname: 'test2',
            gender: 1,
            birthday: '1958-10-15 00:00:00', // "1958-10-15 00:00:00" → "1958-10-15"
            country: 'vioetnnam',
          },
])
console.log("insertError: ", insertError);
