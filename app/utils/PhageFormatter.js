/* eslint-disable camelcase */
// FIXME: use camelcase
export function formatPhageDbPhages(phages) {
  return phages
    .filter(({ fasta_file }) => Boolean(fasta_file))
    .map(({
      phage_name,
      old_names,
      pcluster,
      psubcluster,
      isolation_host,
      end_type,
      fasta_file
    }) => ({
      phage_name,
      old_names,
      genus: isolation_host ? isolation_host.genus : '',
      cluster: pcluster ? pcluster.cluster : 'Unclustered',
      subcluster: psubcluster ? psubcluster.subcluster : 'None',
      end_type: end_type === 'CIRC' ? 'circular' : end_type,
      fasta_file
    }));
}
/* eslint-enable */

export function formatPetPhages(phages) {
  return phages.map(phage => {
    const values = phage.split('\t');
    return ['phage_name', 'genus', 'cluster', 'subcluster'].reduce(
      (accumulator, curr, i) =>
        Object.assign(accumulator, {
          [curr]: values[i]
        }),
      {}
    );
  });
}
