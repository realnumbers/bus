#!/bin/sh

split_de(){
	city_name_de=${city_name_de//) /|}
	de=${city_name_de//(/}
	read -ra ADDR <<< "$de"
	city_de=${ADDR[0]}
	name_de=${ADDR[1]}
}

split_it(){
	city_name_it=${city_name_it//) /|}
	it=${city_name_it//(/}
	read -ra ADDR <<< "$it"
	city_it=${ADDR[0]}
	name_it=${ADDR[1]}
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
	export IFS="|"
	j=0;
	cat api_ids_busstops | while read id city_name_it city_name_de ;
	do 
		split_it
		split_de
		if [ $j -ne 0 ]; then
		echo "," >> de.json
		echo "," >> it.json
		fi
		j=1
		gen_json_de >> de.json
		gen_json_it >> it.json

	done
}
TARGET=../js/busstops.json
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
