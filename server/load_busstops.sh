#!/bin/sh

split_name(){
	name=${name// - /;}
	read -ra ADDR <<< "$name"
	name_it=${ADDR[0]}
	name_de=${ADDR[1]}
}

split_city(){
	city=${city// - /;}
	read -ra ADDR <<< "$city"
	city_it=${ADDR[0]}
	city_de=${ADDR[1]}
}
gen_json_de(){
	echo -n "{ 
		\"label\"   : \"$name_de, $city_de\",
		\"name\" : \"$name_de\",
		\"city\" : \"$city_de\",
		\"id\" : \"$id\"
	
	}";
}
gen_json_it(){
	echo -n "{ 
		\"label\"   : \"$name_it, $city_it\",
		\"name\" : \"$name_it\",
		\"city\" : \"$city_it\",
		\"id\" : \"$id\"
	
	}";
}
parse(){
	export IFS=";"
	cat fermate.csv | while read id dummy name dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummydummy city dummy ;
	do 
		if [ "$id" != "Numero esterno" ]; then
			split_name
			split_city
			if [ "$prec" != "Numero esterno" ]; then
				echo "," >> de.json
				echo "," >> it.json
			fi
		gen_json_de >> de.json
		gen_json_it >> it.json
			prec="0"
		else
			prec="Numero esterno"
		fi

	done
}
find_secound()
sTARGET=../js/busstops.json
rm $TARGET 
parse
echo "{
	\"de\" : [" >> $TARGET
cat de.json >> $TARGET
echo "], " >> $TARGET
echo "\"it\" : [" >> $TARGET
cat it.json >> $TARGET
echo "" >> $TARGET
echo "]" >> $TARGET
echo "}" >> $TARGET
cat $TARGET | json_verify -u
rm de.json
rm it.json

