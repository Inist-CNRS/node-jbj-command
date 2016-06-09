
cat ./sample.nt | ../bin/jbj --use parse -use nlp --text-output --multi-line ./style02.json -

cat ./sample.json | ../bin/jbj -use parse --use nlp --multi-json ./style01.json -

cat ./sample.csv | ../bin/jbj --encoding binary --use parse --use nlp --multi-line ./style03.json -

zcat ~/Datasets/rdf/geonames.nt.gz | grep  "#name\|#alternateName\|countryCode" | ./bin/jbj --use parse -use nlp --text-output --multi-line ./style02.json -

zcat ~/Datasets/rdf/geonames.nt.gz | grep  "#name\|#alternateName\|countryCode" | head -1000  | ./bin/jbj --use parse -use nlp --text-output --multi-line ./style02.json -


