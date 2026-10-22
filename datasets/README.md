# datasets/

Contents of this folder are ignored by Git (see .gitignore). Only this file and
the Urdu collection template are tracked.

Planned layout (create as you go):

    datasets/raw/                 downloads, untouched
    datasets/processed/ff/{train,val,test}/{0_real,1_fake}/
    datasets/processed/celebdf_test/{0_real,1_fake}/    cross-dataset holdout, never used for tuning
    datasets/pk_benchmark/        pilot Pakistan benchmark (metadata + files or URLs)

Folder naming rule: name classes `0_real` and `1_fake` so ImageFolder assigns
real=0 and fake=1. Alphabetical order would otherwise make fake=0.
Record the source, license and access date of every dataset in docs/dataset-notes.md.
