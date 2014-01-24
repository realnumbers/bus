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
splitID(){
	id=${id//\"/;}
	read -ra ADDR <<< "$id"
	id=${ADDR[3]}
}

addID(){
	id_line=`expr $j - 3`
	id=`sed -n ${id_line}p busstops.json`
	splitID
	id_1=$id
	id_line=`expr $i + 5`
	id=`sed -n ${id_line}p busstops.json`
	sed -i ${id_line}d busstops.json
	splitID
	id_2=$id
	id=${id_1}":"${id_2}
	id="   \"id\" : \"$id\""
	id_line=`expr $i + 5`
	sed -i "$id_line i\ $id" busstops.json
}
getIDs(){
	i=3
	j=11
	current_line="undefined"
	label="undefined"
	next_line="undefined"
	while [ "$current_line" != "" ]; do
		current_line=`sed -n ${i}p busstops.json`
		while [ "$label" != "$current_line" ] && [ "$next_line" != "" ]; do
			label=`sed -n ${j}p busstops.json`
			echo My line on $j is $label
		j=`expr $j + 8`
			next_line=`sed -n ${j}p busstops.json`
		done
		if [ "$label" = "$current_line" ]; then
			addID
			star=`expr $j - 9`
			end=`expr $j - 2`
			echo I delet lines form $star to $end
			sed -i ${star},${end}d busstops.json
			echo Cur: $current_line
			echo Lab: $label
		fi
		label="undefined"
		next_line="undefined"
		i=`expr $i + 8`
		j=`expr $i + 8`
	done
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
		\"label\"   : \"$name_de, $city_de - $name_it, $city_it\",
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
cat busstops.json | json_verify -u
getIDs
cat busstops.json | json_verify -u
