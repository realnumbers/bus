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
parse(){
	export IFS=";"
	echo [
	cat fermate.csv | while read id dummy name dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummydummy city dummy ;
	do 
		if [ "$id" != "Numero esterno" ]; then
			split_name
			split_city
			if [ "$prec" != "Numero esterno" ]; then
				echo ","
			fi
	echo -n "{ 
		\"name_de\" : \"$name_de\",
		\"name_it\" : \"$name_it\",
		\"city_de\" : \"$city_de\",
		\"city_it\" : \"$city_it\",
		\"id\" : \"$id\"
	
	}";
			prec="0"
		else
			prec="Numero esterno"
		fi

	done
	echo
	echo ]
}
parse > busstops.json
